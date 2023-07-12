<script setup>
import { ref } from "vue";
import { MapboxMap,  MapboxNavigationControl, MapboxMarker } from '@studiometa/vue-mapbox-gl';

const mapCenter = ref([0, 0]);
</script>

<template>
<MapboxMap
  class="h-screen w-full"
  access-token="pk.eyJ1IjoieHowNiIsImEiOiJjbGpmdnh5dW8wNWJ6M2V0Z3pkYWJjOG5kIn0.hYRGQslF5gcVLyleu7Zdyg"
  map-style="mapbox://styles/mapbox/streets-v11"
  :center="mapCenter"
  :zoom="2">
  <MapboxMarker :lng-lat="[0, 0]" />
  <MapboxNavigationControl position="bottom-right" />
  </MapboxMap>
</template>