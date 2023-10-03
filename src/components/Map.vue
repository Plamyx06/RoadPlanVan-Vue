<template>  
  <div ref="mapContainer" class="map-container" id="map"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import mapboxgl from "mapbox-gl";
import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.css';
import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.js'
import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '/home/plamyx/Code/RoadPlanVan/src/assets/style/mapbox-gl-geocoder-custom.css';
import '/home/plamyx/Code/RoadPlanVan/src/mapbox-gl-direction/mapbox-gl-directions.css'

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
    zoom: 3
  });

  map.addControl(new MapboxLanguage({
    defaultLanguage: 'fr'
  }));


  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    steps:true,
    language: 'fr-FR',
    unit: 'metric',
    profile: 'mapbox/driving',
    geocoder: {
      bbox: [-31.266001, 27.636311, 40.190342, 81.281509],
    },
    controls: {
      instructions: false,
      marker: false
    },
    placeholderOrigin: 'Lieu de départ',
    placeholderDestination: 'Destination',
   styles : [{
              id: 'directions-route-line-casing',
              type: 'line',
              source: 'directions',
              layout: {
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-color': '#2d5f99',
                'line-width': 3
              },
              filter: ['all', ['in', '$type', 'LineString'], ['in', 'route', 'selected']]
            },{
              id: 'directions-origin-point',
              type: 'circle',
              source: 'directions',
              paint: {
                'circle-radius': 12,
                'circle-color': '#8A4852'
              },
              filter: ['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'A']]
            },
            {
              id: 'directions-origin-label',
              type: 'symbol',
              source: 'directions',
              layout: {
                'text-field': '1',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12
              },
              paint: {
                'text-color': '#fff'
              },
              filter: ['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'A']]
            },
            {
              id: 'directions-destination-point',
              type: 'circle',
              source: 'directions',
              paint: {
                'circle-radius': 12,
                'circle-color': '#8A4852'
              },
              filter: ['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'B']]
            },
            {
              id: 'directions-destination-label',
              type: 'symbol',
              source: 'directions',
              layout: {
                'text-field': '2',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12
              },
              paint: {
                'text-color': '#fff'
              },
              filter: ['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'B']]
            }]
  });
  directions.on('route', (e) => {
  const route = e.route[0];  


 
  const durationInSeconds = route.duration;
  const distanceInMeters = route.distance;

  
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds - (hours * 3600)) / 60);

  
  const distanceInKm = Math.floor(distanceInMeters / 1000);



const consommation = 10; 
const prixCarburant = 1.5; 

const litresNecessaires = (distanceInKm / 100) * consommation;
const coutCarburant = litresNecessaires * prixCarburant;

directions.on('route', (e) => {console.log(e)})


console.log(route)
console.log(`Le coût du carburant pour un trajet de ${distanceInKm} km est de ${coutCarburant.toFixed(2)} euros.`);
  console.log(`Duration: ${hours} h ${minutes} min`);
  console.log(`Distance: ${distanceInKm} km`);
});

document.getElementById('direction').appendChild(directions.onAdd(map));


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

