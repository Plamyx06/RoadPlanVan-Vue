<script setup>
import LocationCard from '../components/LocationCard.vue';
import { PlusIcon } from '@heroicons/vue/20/solid';
import { defineProps, ref, watchEffect, computed } from 'vue';
import VueDraggable from 'vuedraggable';
import emitter from '/home/plamyx/Code/RoadPlanVan/src/components/utility/eventBus.js';
import DeleteModal from '/home/plamyx/Code/RoadPlanVan/src/components/DeleteModal.vue';
import Road from '/home/plamyx/Code/RoadPlanVan/src/components/RoadInformation.vue';
import Spinner from '/home/plamyx/Code/RoadPlanVan/src/components/Spinner.vue'


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



function handleDraggableChange() {
  emitter.emit('get-road-draggable', mutableWaypoints.value);
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
  return Math.ceil((totalDistance.value / 100) * 8 * 1.8);
});

function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}h${formattedMinutes}`;
}
const isLoading = ref(false)

watchEffect(() => {
  mutableWaypoints.value = props.waypoints;
});


</script>

<template>
  <div class="container fixed mt-[40vh] h-[53vh] overflow-y-auto">
    <div class="flex justify-between mt-3 px-5">
      <div class="w-7/12 mb-3">
        <div id="geocoder" class="geocoder"></div>
        <div v-if="noWaypoint" class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4 text-red-500">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-500 text-sm">
            Aucune destination</p>
        </div>
        <div v-if="waypointExist" class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4 text-red-500">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-500 text-sm">
            déjà ajouté</p>
        </div>
      </div>

      <div>
        <button type="button" @click="addNewWaypoint" style="background-color: #8A4852; color: #F8F4E8;"
          class="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

    </div>
    <div class="mb-[-3px]">

    </div>

    <div class="flex items-center">
      <div class="w-5/6">
        <VueDraggable class="" v-model="mutableWaypoints" item-key="index" @change="handleDraggableChange">

          <template v-slot:item="{ element, index }">
            <div>
              <div class="flex items-center h-12 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 0100 1.5z" />
                </svg>

                <LocationCard :lon="element.lon" :lat="element.lat" :city="element.city"
                  :placeLocation="element.placeLocation" />

                <button v-if="index > 0" @click="openDeleteModal(element)"
                  style="background-color: #8A4852; color: #F8F4E8;"
                  class="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-3">
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
        <template v-for="(waypoint, index) in mutableWaypoints">
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
