<template>
  <div ref="mapContainer" class="map-container" id="map"
></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import mapboxgl from "mapbox-gl";
import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.css';
import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.js'
import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '/home/plamyx/Code/RoadPlanVan/src/assets/style/mapbox-gl-geocoder-custom.css';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from '@mapbox/mapbox-gl-language';

const latitude = ref(0);
const longitude = ref(0);
const placeName = ref("");
const placeLocation = ref("")
const emit = defineEmits();

onMounted(() => {
      mapboxgl.accessToken = import.meta.env.VITE_APP_API_KEY ;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [2.3522, 48.8566],
    zoom: 4
  });

  map.addControl(new MapboxLanguage({
    defaultLanguage: 'fr'
  }));
 
  const geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl,
    language: 'fr-FR',
    types: 'place',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    
  });

geocoder.on('result', (event) => {
    const { center, context, text } = event.result;
    let city = '';
    let country = '';

    if (context) {
        for (let item of context) {
            if (item.id.startsWith('place')) {
                city = item['text_fr-FR']; 
            }
            if (item.id.startsWith('country')) {
                country = item['text_fr-FR']; 
            }
        }
    } 

    
    latitude.value = center[1];
    longitude.value = center[0];
    placeName.value =`${text}`
    placeLocation.value = city ? `${city}, ${country}` : `${country}`;
    
    emit('location-selected', {
        latitude: latitude.value,
        longitude: longitude.value,
        placeName: placeName.value,
        placeLocation: placeLocation.value
    });
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


})


</script>

<style scoped>
.map-container {
  width: 100%;
  height: 92vh;
  position: absolute;
}

</style>

<style>
.mapboxgl-ctrl-bottom-left {
  display: none;
}
</style>

