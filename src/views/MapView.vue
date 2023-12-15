<script setup>
import { ref } from 'vue';

import Map from '@/components/mapView/map/Map.vue';
import LayoutApp from '@/components/mapView/LayoutApp.vue';
import Layout from '@/components/mapView/Layout.vue';

import ItineraryOptionsAndDetails from '@/components/mapView/ItineraryOptionsAndDetails.vue';
import mapEmitter from '@/components/mapView/mapEvent.js';

const waypoints = ref([]);
const showItineraryOptionsAndDetails = ref(true)

function updateWaypoints(updatedWaypoints) {
  waypoints.value = updatedWaypoints;
};



</script>



<template>
  <main>
    <Layout />
    <Map @update-waypoints="updateWaypoints" />
    <ItineraryOptionsAndDetails v-show="showItineraryOptionsAndDetails" :waypoints="waypoints" />
  </main>
</template>


