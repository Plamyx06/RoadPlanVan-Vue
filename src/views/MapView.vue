<script setup>
import { ref } from 'vue';

import Map from '@/components/mapView/map/Map.vue';
import LayoutApp from '@/components/mapView/LayoutApp.vue';
import ItineraryOptionsAndDetails from '@/components/mapView/ItineraryOptionsAndDetails.vue';
import mapEmitter from '@/components/mapView/mapEvent.js';

const waypoints = ref([]);
const selectedButton = ref('itinerary');
const mapFullSize = ref(false)
const showItineraryOptionsAndDetails = ref(true)

function updateWaypoints(updatedWaypoints) {
  waypoints.value = updatedWaypoints;
};

function handleMapButton(button) {
  selectedButton.value = button;
  if (button === 'map') {
    mapFullSize.value = true;
    showItineraryOptionsAndDetails.value = false
    mapEmitter.emit('resize-map');
  }
  else if (button === 'itinerary') {
    mapFullSize.value = false;
    showItineraryOptionsAndDetails.value = true
    mapEmitter.emit('resize-map');
  }
}


</script>



<template>
  <main>
    <Map @update-waypoints="updateWaypoints" :is-full-size="mapFullSize" />
    <ItineraryOptionsAndDetails v-show="showItineraryOptionsAndDetails" :waypoints="waypoints" />
    <LayoutApp @select-button="handleMapButton" />
  </main>
</template>

<style scoped></style>
