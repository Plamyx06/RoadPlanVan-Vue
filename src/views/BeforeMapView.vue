<script setup>
import BeforeMap from '../components/BeforeMap.vue';
import Map from '../components/Map.vue';
import LayoutApp from '../components/LayoutApp.vue';
import { ref} from "vue";

const selectedLatitude = ref(0);
const selectedLongitude = ref(0);
const selectedPlaceName = ref('');
const selectedPlaceLocation = ref('')

const updateLocation = (location) => {
    console.log("Received location:", location);
    selectedLatitude.value = location.latitude;
    selectedLongitude.value = location.longitude;
    selectedPlaceName.value = location.placeName;
    selectedPlaceLocation.value = location.placeLocation
};
</script>

<template>
  <main>
  <Map class="map-container" @location-selected="updateLocation"/>
  
    <BeforeMap :latitude="selectedLatitude" :longitude="selectedLongitude" :placeName="selectedPlaceName" :placeLocation="selectedPlaceLocation"/>
  <LayoutApp/>

  </main> 

</template>

<style scoped>

.map-container {
  width: 100%;
  height: 40vh;
  position: absolute;
}


</style>