<script setup>
import LocationCard from '../components/LocationCard.vue'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { defineProps, ref } from 'vue';
import Draggable from 'vuedraggable';

const props = defineProps(['waypoints']);

import emitter from '/home/plamyx/Code/RoadPlanVan/src/components/utility/eventBus.js';

const triggerEvent = () => {
  emitter.emit('add-point');
}
</script>

<template>  
<div class="container fixed mt-[264px] px-5 h-[400px]">
  <div class="flex justify-between mt-3">
    <div class="w-7/12 ">
      <div id="geocoder" class="geocoder "></div>
    </div>
    <div>
      <button type="button" @click="triggerEvent" style="background-color: #8A4852; color: #F8F4E8;" class="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        <PlusIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </div>

  <!-- Utilisation de Vue Draggable pour rendre les cartes déplaçables -->
  <Draggable v-model="props.waypoints" :key="waypoint.id">
    <LocationCard v-for="waypoint in props.waypoints" :lon="waypoint.lon" :lat="waypoint.lat" :city="waypoint.city" :placeLocation="waypoint.placeLocation" />
  </Draggable>
</div>
</template>

<style scoped>
.container {
  font-family: 'Kalam', cursive;
  background-color: #F8EDE0;
  color: #8A4852;
}
body { margin: 0; padding: 0; }
</style>
