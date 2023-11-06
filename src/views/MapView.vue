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
    <Map @update-waypoints="updateWaypoints" />
    <BeforeMap v-show="showBeforeMap" @hide="transitionToItinerary" />
    <ItineraryMap v-show="showItineraryMap" :waypoints="waypoints" />
    <LayoutApp />
  </main>
</template>

<style scoped>
.container {
  font-family: 'Nunito Sans', sans-serif;
  background-color: #F8EDE0;
  color: #8A4852;
}
</style>
