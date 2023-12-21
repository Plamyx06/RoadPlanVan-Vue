<script setup>
import { ref } from 'vue';
import Map from '@/components/mapView/map/Map.vue';
import Layout from '@/components/mapView/Layout.vue';
import ItineraryOptionsAndDetails from '@/components/mapView/ItineraryOptionsAndDetails.vue';


const waypoints = ref([]);

function updateWaypoints(updatedWaypoints) {
  waypoints.value = updatedWaypoints;
};



</script>



<template>
  <main>
    <Layout />
    <Map />
    <ItineraryOptionsAndDetails />
  </main>
</template>


