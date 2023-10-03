<script setup>
import { ref } from 'vue';
import BeforeMap from '../components/BeforeMap.vue';
import Map from '../components/Map.vue';
import LayoutApp from '../components/LayoutApp.vue';
import ItineraryMap from '../components/ItinaryMap.vue'; 

const showBeforeMap = ref(true);
const showItineraryMap = ref(false); 


const transitionToItinerary = () => {
  showBeforeMap.value = false;
  showItineraryMap.value = true;  
};

</script>

<template>
  <main>
    <Map class="map-container"/>
  <BeforeMap v-show="showBeforeMap" @hide="transitionToItinerary" /> 
  
    <ItineraryMap v-show="showItineraryMap">  
    </ItineraryMap>   
      <LayoutApp/>
  </main> 
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 40vh;
  position: absolute;
}
.container {
  font-family: 'Kalam', cursive;
  background-color: #F8EDE0;
  color: #8A4852;
}

</style>
