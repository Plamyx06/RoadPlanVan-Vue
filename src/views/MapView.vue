<script setup>
import { ref } from 'vue';

import Map from '@/components/map/Map.vue';
import LayoutApp from '@/components/layout/LayoutApp.vue';
import ItineraryOptionsAndDetails from '@/components/pages/ItineraryOptionsAndDetails.vue';


const waypoints = ref([]);


function updateWaypoints(updatedWaypoints) {
  waypoints.value = updatedWaypoints;
};



</script>



<template>
  <main>
    <Map @update-waypoints="updateWaypoints" />
    <ItineraryOptionsAndDetails :waypoints="waypoints" />
    <LayoutApp />
  </main>
</template>

<style scoped></style>
