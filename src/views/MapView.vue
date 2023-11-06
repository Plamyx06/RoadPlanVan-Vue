<script setup>
import { ref } from 'vue';
import BeforeMap from '../components/BeforeMap.vue';
import Map from '../components/Map.vue';
import LayoutApp from '../components/LayoutApp.vue';
import ItineraryMap from '../components/ItinaryMap.vue';


const showBeforeMap = ref(true);
const showItineraryMap = ref(false);


const waypoints = ref([]);

const transitionToItinerary = () => {
  showBeforeMap.value = false;
  showItineraryMap.value = true;
};


const updateWaypoints = (updatedWaypoints) => {
  waypoints.value = updatedWaypoints;

};

</script>

<template>
  <main>
    <div class="container">
      <Map @update-waypoints="updateWaypoints" />
      <BeforeMap v-show="showBeforeMap" @hide="transitionToItinerary" />
    </div>
    <ItineraryMap v-show="showItineraryMap" :waypoints="waypoints" />
  </main>
</template>

<style scoped></style>
