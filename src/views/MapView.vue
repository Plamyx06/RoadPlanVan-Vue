<script setup>
import { ref } from 'vue';
import BeforeMap from '../components/BeforeMap.vue';
import Map from '../components/Map.vue';
import LayoutApp from '../components/LayoutApp.vue';
import ItineraryMap from '../components/ItinaryMap.vue';
import emitter from '../components/utility/eventBus';

const showBeforeMap = ref(true);
const previousShowBeforeMap = ref(true);
const showItineraryMap = ref(false);
const previousShowItineraryMap = ref(false);
const waypoints = ref([]);
const mapFullSize = ref(false);
const selectedButton = ref('itinerary');

const updateWaypoints = (updatedWaypoints) => {
  waypoints.value = updatedWaypoints;
};

const transitionToItinerary = () => {
  showBeforeMap.value = false;
  showItineraryMap.value = true;
};


const handleSelectedButton = (button) => {
  selectedButton.value = button;

  if (button === 'card') {
    previousShowBeforeMap.value = showBeforeMap.value;
    previousShowItineraryMap.value = showItineraryMap.value;
    mapFullSize.value = true;
    showItineraryMap.value = false;
    showBeforeMap.value = false;
    emitter.emit('Resize-map');
  } else if (button === 'itinerary') {
    mapFullSize.value = false;
    showItineraryMap.value = previousShowItineraryMap.value;
    showBeforeMap.value = previousShowBeforeMap.value;
    emitter.emit('Resize-map');
  }



};
</script>


<template>
  <main>
    <Map @update-waypoints="updateWaypoints" :is-full-size="mapFullSize" />
    <BeforeMap v-show="showBeforeMap" @hide="transitionToItinerary" />
    <ItineraryMap v-show="showItineraryMap" :waypoints="waypoints" />
    <LayoutApp @select-button="handleSelectedButton" />
  </main>
</template>

<style scoped>
.container {
  font-family: 'Nunito Sans', sans-serif;
  background-color: #F8EDE0;
  color: #8A4852;
}
</style>
