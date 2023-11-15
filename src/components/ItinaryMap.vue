<script setup>
import LocationCard from '../components/LocationCard.vue';
import { PlusIcon } from '@heroicons/vue/20/solid';
import { defineProps, ref, watchEffect, computed } from 'vue';
import VueDraggable from 'vuedraggable';
import emitter from '../components/utility/eventBus.js';
import DeleteModal from '../components/DeleteModal.vue';
import Road from '../components/RoadInformation.vue';
import ErrorAlert from '../components/ErrorAlert.vue'


const props = defineProps(['waypoints']);
const mutableWaypoints = ref(props.waypoints);

function addNewWaypoint() {
  emitter.emit('add-point');
  mutableWaypoints.value = props.waypoints;
}
const noWaypoint = ref(false);

emitter.on('noWaypoint', () => {
  noWaypoint.value = true;
  setTimeout(() => {
    noWaypoint.value = false;
  }, 3000);
});
const waypointExist = ref(false)
emitter.on('waypointExist', () => {
  waypointExist.value = true;
  setTimeout(() => {
    waypointExist.value = false;
  }, 3000);
});

const enableLoopMode = ref(true);
emitter.on('enabled-loop', (enabledValue) => {
  enableLoopMode.value = enabledValue
});
const isLoading = ref(false)
emitter.on('isLoading', (loadingValue) => {
  isLoading.value = loadingValue
  console.log(isLoading.value)
});



const clonedWaypoints = ref([]);

function handleDraggableStart() {
  clonedWaypoints.value = [...mutableWaypoints.value];
}

function handleDraggableChange() {
  if (enableLoopMode) {
    if (clonedWaypoints.value.length > 0) {
      if (clonedWaypoints.value.length !== mutableWaypoints.value.length) {
        mutableWaypoints.value = clonedWaypoints.value;
        clonedWaypoints.value = [];
      } else if (
        (mutableWaypoints.value[0].id !== clonedWaypoints.value[0].id ||
          mutableWaypoints.value[mutableWaypoints.value.length - 1].id !==
          clonedWaypoints.value[mutableWaypoints.value.length - 1].id) && enableLoopMode
      ) {
        mutableWaypoints.value = clonedWaypoints.value;
        clonedWaypoints.value = [];
      }
    }
    if (clonedWaypoints.value.length > 0) {
      emitter.emit('get-road-draggable', mutableWaypoints.value);
    }
  } else if (!enableLoopMode) {
    emitter.emit('get-road-draggable', mutableWaypoints.value);
  }

}


const showDeleteModal = ref(false)
const deleteObject = ref({})

function openDeleteModal(element) {
  deleteObject.value = element
  showDeleteModal.value = true
}
function handleCancel() {

  showDeleteModal.value = false
}

function handleDelete() {
  const idToDelete = deleteObject.value.id;
  const index = mutableWaypoints.value.findIndex(waypoint => waypoint.id === idToDelete);
  mutableWaypoints.value.splice(index, 1);
  emitter.emit('get-road-delete', mutableWaypoints.value);
  showDeleteModal.value = false
}

const PRICE_GASOLINE = 1.9
const consumption = ref()


emitter.on('consumption-value', handleConsumption)
function handleConsumption(consumptionUser) {
  consumption.value = consumptionUser

}

const totalDuration = computed(() => {
  return mutableWaypoints.value.reduce((total, waypoint) => {
    return total + parseInt(waypoint.duration || 0);
  }, 0);
});

const totalDistance = computed(() => {
  return mutableWaypoints.value.reduce((total, waypoint) => {
    return total + parseInt(waypoint.distance || 0);
  }, 0);
});
const totalPrice = computed(() => {
  console.log('calcul')
  return Math.ceil((totalDistance.value / 100) * consumption.value * PRICE_GASOLINE);
});

function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}h${formattedMinutes}`;
}


watchEffect(() => {
  mutableWaypoints.value = props.waypoints;
});


</script>

<template>
  <div class="container fixed mt-[50vh] h-[50vh] w-screen overflow-y-auto">
    <div class="flex justify-between items-center my-5 px-5">
      <div class="w-7/12 ">
        <div id="geocoder" class="geocoder"></div>
      </div>
      <div>
        <button type="button" @click="addNewWaypoint" class="rounded-full bg-redCustom p-1 text-beigeCustom shadow-sm">
          <PlusIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

    </div>
    <div class="px-5">
      <ErrorAlert v-if="noWaypoint" text="Aucune destination !" />
      <ErrorAlert v-if="waypointExist" text="Cet destination a déjà été ajouté" />
    </div>

    <div class="flex items-center mt-3">
      <div class="w-5/6">
        <VueDraggable class="" v-model="mutableWaypoints" handle=".drag-handle" item-key="index"
          @change="handleDraggableChange" @start="handleDraggableStart">

          <template v-slot:item="{ element, index }">
            <div>
              <div class="flex items-center h-12 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 0100 1.5z" />
                </svg>

                <LocationCard v-if="index === 0 || (index === mutableWaypoints.length - 1 && enableLoopMode)"
                  :lon="element.lon" :lat="element.lat" :city="element.city" :country="element.country"
                  :countryCode="element.countryCode" />

                <LocationCard v-else :lon="element.lon" :lat="element.lat" :city="element.city" :country="element.country"
                  :countryCode="element.countryCode" :class="{ 'drag-handle': index > 0 }" />

                <button
                  v-if="!enableLoopMode && index > 0 || (enableLoopMode && index > 0 && index < (mutableWaypoints.length - 1))"
                  @click="openDeleteModal(element)" :disabled="isLoading"
                  class="rounded-full bg-redCustom p-1 text-beigeCustom shadow-sm ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>


              </div>

              <template v-if="element.duration !== '' && index !== (mutableWaypoints.length - 1)">
                <Road :duration="formatDuration(element.duration)" :distance="element.distance"
                  :price="Math.ceil((element.distance / 100) * 8 * 1.8)" />
              </template>

            </div>
          </template>
        </VueDraggable>
      </div>
      <div class="w-1/6 flex items-center flex-col space-between h-full" style="position: relative;">
        <template v-for="( waypoint, index ) in  mutableWaypoints ">
          <button v-if="index === 0 || index === mutableWaypoints.length - 1"
            class="rounded-full w-5 h-5 text-center py-1 text-sm " style=" background-color: #8A4852;">
          </button>
          <button v-else class="rounded-full w-5 h-5 text-sm font-semibold  pl-px"
            style="border: 1px solid #8A4852; background-color: transparent;">
            {{ index + 1 }}
          </button>


          <div v-if="index !== mutableWaypoints.length - 1"
            class="border-l-2 border-dashed h-[56px] border-custom-color animate-opacity"
            :style="`animation-delay: ${index * 0.5}s`"></div>


        </template>

      </div>




    </div>


    <div v-if="mutableWaypoints.length > 2">
      <div class="border-b border-gray-500 my-3 mx-5 border-custom-color"></div>
      <div class="px-5 flex justify-between items-center">
        <p class="">Total :</p>
        <Road class="" :duration="formatDuration(totalDuration)" :distance="totalDistance" :price="totalPrice">

        </Road>

      </div>

    </div>



    <DeleteModal :show="showDeleteModal" :cancel="handleCancel" :deleted="handleDelete" :city="deleteObject.city"
      :placeLocation="deleteObject.placeLocation" />
  </div>
</template>


<style scoped>
.border-custom-color {
  border-color: #8A4852;

}

.container {
  font-family: 'Kalam', cursive;
  background-color: #F8EDE0;
  color: #8A4852;
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
