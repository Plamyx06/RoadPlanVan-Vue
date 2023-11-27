<script setup>

import { defineProps, ref, watchEffect, computed } from 'vue';
import emitter from '@/components/utility/eventBus.js';
import VueDraggable from 'vuedraggable';
import { PlusIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import LocationCard from '@/components/cards/LocationCard.vue';
import Delete from '@/components/modal/Delete.vue';
import Road from '@/components/RoadInformation.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import RoundedButton from '@/components/button/RoundedButton.vue';
import MainButton from '@/components/button/MainButton.vue';
import Register from '@/components/modal/Register.vue'


const props = defineProps(['waypoints']);
const mutableWaypoints = ref(props.waypoints);
const clonedWaypoints = ref([]);
const noWaypoint = ref(false);
const waypointExist = ref(false);
const enableReturnStart = ref(true);
const isLoading = ref(false);
const showDeleteModal = ref(false);

const deleteLocation = ref({});
const consumption = ref();


const PRICE_GASOLINE = 1.9;

// Emitter Event Handlers
emitter.on('no-waypoint', () => errorAlert(noWaypoint));
emitter.on('waypoint-exist', () => errorAlert(waypointExist));
emitter.on('enabled-return-start', (value) => enableReturnStart.value = value);
emitter.on('is-loading', (value) => isLoading.value = value);
emitter.on('consumption-value', (value) => consumption.value = value);

// Event Handlers
function addNewWaypoint() {
  emitter.emit('add-point');
  mutableWaypoints.value = props.waypoints;
}
function openDeleteModal(element) {
  deleteLocation.value = element;
  showDeleteModal.value = true;
}
function handleCancel() {
  showDeleteModal.value = false;
}
function handleDelete() {
  const idToDelete = deleteLocation.value.id;
  const index = mutableWaypoints.value.findIndex(waypoint => waypoint.id === idToDelete);
  mutableWaypoints.value.splice(index, 1);
  emitter.emit('get-road-delete', mutableWaypoints.value);
  showDeleteModal.value = false;
}
function handleSave() {
  emitter.emit('open-save-modal')
}


// Draggable Handlers
function handleDraggableStart() {
  clonedWaypoints.value = [...mutableWaypoints.value];
}

function handleDraggableChange() {
  if (enableReturnStart.value && clonedWaypoints.value.length > 0) {
    mutableWaypoints.value = clonedWaypoints.value;
    clonedWaypoints.value = [];
    emitter.emit('get-road-draggable', mutableWaypoints.value);
  }
  else {
    emitter.emit('get-road-draggable', mutableWaypoints.value);
  }
}

// Utility Functions
function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}h${formattedMinutes}`;
}

function errorAlert(alert) {
  alert.value = true;
  setTimeout(() => alert.value = false, 3000);
}

// Calculate Price Duration
const totalDuration = computed(() => calculateTotal(mutableWaypoints.value, 'duration'));
const totalDistance = computed(() => calculateTotal(mutableWaypoints.value, 'distance'));
const totalPrice = computed(() => calculatePrice(totalDistance.value, consumption.value, PRICE_GASOLINE));


function calculateTotal(waypoints, key) {
  return waypoints.reduce((total, waypoint) => total + parseInt(waypoint[key] || 0), 0);
}

function calculatePrice(distance, consumption, priceGasoline) {
  return Math.ceil((distance / 100) * consumption * priceGasoline);
}


watchEffect(() => {
  mutableWaypoints.value = props.waypoints;
});

</script>

<template>
  <div
    class="fixed mt-[49vh] h-[51vh] w-screen overflow-y-auto bg-beige-custom text-red-custom px-5 lg:max-w-lg lg:w-4/12 lg:mt-[10vh]  lg:h-[85vh] lg:ml-5 lg:drop-shadow-lg lg:rounded-b-lg">
    <div class="sm:max-w-lg sm:mx-auto ">
      <div class="flex justify-between items-center my-5 px-5 sm:max-w-2xl">
        <div class="w-7/12 ">
          <div id="geocoder" class="geocoder"></div>
        </div>
        <div>
          <RoundedButton @click="addNewWaypoint">
            <PlusIcon class="h-5 w-5" aria-hidden="true" />
          </RoundedButton>
        </div>

      </div>
      <div class="px-5">
        <ErrorAlert v-if="noWaypoint" text="Aucune destination !" />
        <ErrorAlert v-if="waypointExist" text="Cet destination a déjà été ajouté" />
      </div>

      <div class="flex items-center mt-3">
        <div class="w-5/6">
          <VueDraggable v-model="mutableWaypoints" handle=".drag-handle" item-key="index" @change="handleDraggableChange"
            @start="handleDraggableStart">

            <template v-slot:item="{ element, index }">
              <div>
                <div class="flex items-center h-12 ">
                  <EllipsisVerticalIcon class="w-5 h-5" />

                  <LocationCard v-if="index === 0 || (index === mutableWaypoints.length - 1 && enableReturnStart)"
                    :city="element.city" :country="element.country" :countryCode="element.countryCode" />

                  <LocationCard v-else :city="element.city" :country="element.country" :countryCode="element.countryCode"
                    :class="{ 'drag-handle': index > 0 }" />

                  <RoundedButton
                    v-if="!enableReturnStart && index > 0 || (enableReturnStart && index > 0 && index < (mutableWaypoints.length - 1))"
                    @click="openDeleteModal(element)" :disabled="isLoading" class="ml-5">
                    <XMarkIcon class="w-4 h-4" />
                  </RoundedButton>


                </div>

                <template v-if="element.duration !== '' && index !== (mutableWaypoints.length - 1)">
                  <Road :duration="formatDuration(element.duration)" :distance="element.distance"
                    :price="Math.ceil((element.distance / 100) * consumption * PRICE_GASOLINE)" />
                </template>

              </div>
            </template>
          </VueDraggable>
        </div>
        <div class="w-1/6 flex items-center flex-col space-between h-full sm:ml-4 md:ml-12">
          <template v-for="(waypoint, index ) in  mutableWaypoints ">
            <RoundedButton v-if="index === 0 || index === mutableWaypoints.length - 1" class="w-5 h-5 ">
            </RoundedButton>
            <RoundedButton v-else>
              <p class="w-3 h-3 flex items-center justify-center">{{ index + 1 }}</p>
            </RoundedButton>
            <div v-if="index !== mutableWaypoints.length - 1"
              class="border-l-2 border-dashed h-[56px] border-red-custom animate-opacity"
              :style="`animation-delay: ${index * 0.5}s`"></div>
          </template>
        </div>
      </div>

      <div v-if="mutableWaypoints.length > 2">
        <div class="border-b my-3 mx-5 border-red-custom"></div>
        <div class="px-5 flex justify-between items-center max-w-screen ">
          <p>Total :</p>
          <Road :duration="formatDuration(totalDuration)" :distance="totalDistance" :price="totalPrice">
          </Road>

        </div>
      </div>
      <div v-if="mutableWaypoints.length > 2" class="mb-32 mt-6 text-center">
        <MainButton @click="handleSave" text="Sauvegarder" />
      </div>

      <Delete :show="showDeleteModal" :cancel="handleCancel" :deleted="handleDelete">
        Veux-tu supprimer <span class="font-bold">{{ deleteLocation.city }}, {{ deleteLocation.country
        }}</span> de ton RoadTrip ?
      </Delete>
    </div>

  </div>
</template>


<style scoped>
.border-custom-color {
  border-color: #8A4852;
}

body {
  margin: 0;
  padding: 0;
}

@keyframes moveOpacity {

  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

.animate-opacity {
  animation: moveOpacity 3s ease-in-out infinite;
}
</style>
