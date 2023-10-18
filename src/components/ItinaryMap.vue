<script setup>
import LocationCard from '../components/LocationCard.vue';
import { PlusIcon } from '@heroicons/vue/20/solid';
import { defineProps, ref, watchEffect } from 'vue';
import VueDraggable from 'vuedraggable';
import emitter from '/home/plamyx/Code/RoadPlanVan/src/components/utility/eventBus.js';
import DeleteModal from '/home/plamyx/Code/RoadPlanVan/src/components/DeleteModal.vue';
import Road from '/home/plamyx/Code/RoadPlanVan/src/components/RoadInformation.vue';

const props = defineProps(['waypoints']);
const mutableWaypoints = ref(props.waypoints);

function addNewWaypoint() {
  emitter.emit('add-point');
  mutableWaypoints.value = props.waypoints;
  console.log("je suis mutable", mutableWaypoints.value);
}

function handleDraggableChange() {
  emitter.emit('get-road-draggable', mutableWaypoints.value);
}

const showDeleteModal = ref(false);
const deleteObject = ref('')

function openDeleteModal(element) {
  deleteObject.value = element
  console.log('je suis delete object', deleteObject)
  console.log('je suis show delete modal 1', showDeleteModal.value)
  showDeleteModal.value = true;
  console.log('je suis show delete modal 2', showDeleteModal.value)
}

function confirmDeletion() {
  const idToDelete = deleteObject.value.id;
  const index = mutableWaypoints.value.findIndex(waypoint => waypoint.id === idToDelete);
  console.log('je suis id et index', idToDelete, index)
  mutableWaypoints.value.splice(index, 1);
  emitter.emit('get-road-delete', mutableWaypoints.value);
  showDeleteModal.value = false;
  deleteObject.value = ''
}

watchEffect(() => {
  mutableWaypoints.value = props.waypoints;
});
</script>

<template>
  <div class="container fixed mt-[40vh] h-[51vh] overflow-y-auto">
    <div class="flex justify-between mt-3 px-5">
      <div class="w-7/12 mb-3">
        <div id="geocoder" class="geocoder"></div>
      </div>

      <div>
        <button type="button" @click="addNewWaypoint" style="background-color: #8A4852; color: #F8F4E8;"
          class="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>


    <div>
      <VueDraggable class="w-5/6" v-model="mutableWaypoints" item-key="index" @change="handleDraggableChange">
        <DeleteModal :open="showDeleteModal" @confirm="confirmDeletion" :city="deleteObject.city"
          :placeLocation="deleteObject.placeLocation" />
        <template v-slot:item="{ element, index }">
          <div>
            <div class="flex items-center h-12 p-[-5px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 0100 1.5z" />
              </svg>

              <LocationCard :lon="element.lon" :lat="element.lat" :city="element.city"
                :placeLocation="element.placeLocation" />

              <button @click="openDeleteModal(element)" style="background-color: #8A4852; color: #F8F4E8;"
                class="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Road />
          </div>
        </template>
      </VueDraggable>
    </div>


  </div>
</template>


<style scoped>
.container {
  font-family: 'Kalam', cursive;
  background-color: #F8EDE0;
  color: #8A4852;
}

body {
  margin: 0;
  padding: 0;
}
</style>
