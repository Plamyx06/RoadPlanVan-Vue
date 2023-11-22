<script setup>
import { ref } from 'vue';
import StarterOptions from '@/components/pages/StarterOptions.vue';
import Map from '@/components/map/Map.vue';
import LayoutApp from '@/components/layout/LayoutApp.vue';
import ItineraryDetails from '@/components/pages/ItineraryDetails.vue';
import emitter from '@/components/utility/eventBus';

const showStarterOptions = ref(true);
const previousShowStarterOptions = ref(true);
const showItineraryDetails = ref(false);
const previousShowItineraryDetails = ref(false);
const waypoints = ref([]);
const mapFullSize = ref(false);
const selectedButton = ref('itinerary');

function updateWaypoints(updatedWaypoints) {
  waypoints.value = updatedWaypoints;
};

function transitionToItinerary() {
  showStarterOptions.value = false;
  showItineraryDetails.value = true;
};

function handleSelectedButton(button) {
  selectedButton.value = button;
  console.log(selectedButton.value);
  if (button === 'card') {
    previousShowStarterOptions.value = showStarterOptions.value;
    previousShowItineraryDetails.value = showItineraryDetails.value;
    mapFullSize.value = true;
    showItineraryDetails.value = false;
    showStarterOptions.value = false;
    emitter.emit('resize-map');
  } else if (button === 'itinerary') {
    mapFullSize.value = false;
    showItineraryDetails.value = previousShowItineraryDetails.value;
    showStarterOptions.value = previousShowStarterOptions.value;
    emitter.emit('resize-map');
  } else if (button === 'user') {
    mapFullSize.value = false;
    previousShowItineraryDetails.value = showItineraryDetails.value;
    previousShowStarterOptions.value = showStarterOptions.value;
  } else if (button === 'home') {
    mapFullSize.value = false;
  }
};
</script>



<template>
  <main>
    <Map @update-waypoints="updateWaypoints" :is-full-size="mapFullSize" />
    <StarterOptions v-show="showStarterOptions" @hide="transitionToItinerary" />
    <ItineraryDetails v-show="showItineraryDetails" :waypoints="waypoints" />
    <LayoutApp @select-button="handleSelectedButton" />
  </main>
</template>

<style scoped></style>
