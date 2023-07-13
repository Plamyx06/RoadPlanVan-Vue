<script setup>
import { ref, onMounted } from "vue";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';





onMounted(() => {
	mapboxgl.accessToken = 'pk.eyJ1IjoieHowNiIsImEiOiJjbGpmdnh5dW8wNWJ6M2V0Z3pkYWJjOG5kIn0.hYRGQslF5gcVLyleu7Zdyg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [2.3522, 48.8566],
        zoom: 5

    });
map.addControl(new mapboxgl.NavigationControl(),
'bottom-right');

map.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
})
);
});
</script>

<template>
 
  <div class="w-screen h-screen" id="map" ></div>
</template>

<style scoped>
body { margin: 0; padding: 0; }
#map { position: absolute; top: 0; bottom: 0; width: 100%; }
</style>



