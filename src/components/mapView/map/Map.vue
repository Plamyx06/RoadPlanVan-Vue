<template>
  <div id="map" :class="['map-container', { 'map-full': !isFullSize, 'map-container-full': isFullSize }]">
  </div>
  <div v-if="isLoading"
    class="absolute top-0 w-full h-[45vh] bg-gray-500 bg-opacity-40 flex justify-center items-center lg:h-full">
    <Spinner class="w-20 h-20 lg:w-40 lg:h-40" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Spinner from '@/components/mapView/Spinner.vue';
import mapEmitter from '@/components/mapView/mapEvent.js';

import { insertToMinimizeDistance, insertToMinimizeDistanceLoop, sortWaypointsByNearestNeighbor } from '@/components/mapView/map/utils/tspSolver.js'
import {
  getGeojsonMarkerOrigin, getMarkerCircleStyleOrigin, getMarkerTextStyleOrigin
} from '@/components/mapView/map/style/markerOrigin.js';
import { handleResize, createWaypoint, checkLastSearchValue, getPointsIdsFromMap } from '@/components/mapView/map/utils/utility.js';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@/components/mapView/map/style/mapbox-gl-geocoder-custom.css';
import '@/components/mapView/map/style/mapbox-gl-directions-custom.css';

const emit = defineEmits(['update-waypoints']);
const props = defineProps({ isFullSize: Boolean });
const lastSearchedCoords = ref([]);
const waypoints = ref([]);
const enableReturnStart = ref(true);
const isLoading = ref(false);

let map
let geocoderOrigin
let geocoder

onMounted(() => {
  initializeMap();
  setupGeocoder();
  setupGeocoderOrigin()
});

// Emitter Event Handlers
mapEmitter.on('enabled-return-start', (enabledValue) => enableReturnStart.value = enabledValue);
mapEmitter.on('resize-map', () => handleResize(map));
mapEmitter.on('updated-waypoint-origin', async () => await handleGeocoderOrigin());
mapEmitter.on('get-road-draggable', handleGetRoadAfterDraggable);
mapEmitter.on('get-road-delete', handleGetRoadAfterDelete);
mapEmitter.on('add-point', async () => await addWaypointFromSearch());

// Marker Style
const geojsonMarkerOrigin = getGeojsonMarkerOrigin(waypoints);
const markerCircleStyleOrigin = getMarkerCircleStyleOrigin(geojsonMarkerOrigin);
const markerTextStyleOrigin = getMarkerTextStyleOrigin(geojsonMarkerOrigin);


function initializeMap() {
  mapboxgl.accessToken = import.meta.env.VITE_APP_API_KEY
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [2.3522, 48.8566],
    zoom: 3,
    attributionControl: false,
    logoPosition: 'top-left'
  });
  map.addControl(new MapboxLanguage({ defaultLanguage: 'fr' }));
}

//GEOCODEUR
function setupGeocoder() {
  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Ville, ex : Nice, France',
    language: 'fr-FR',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    types: 'place',
    flyTo: {
      speed: 1,
      curve: 1,
      zoom: 3,
      essential: true
    },
    marker: { color: '#8A4852' }
  });
  geocoder.on('result', (event) => {
    const { center } = event.result
    const city = event.result.text
    const countryObject = event.result.context.find((item) => item.id.startsWith('country'))
    const country = countryObject.text
    const countryCode = countryObject.short_code
    const newPoint = createWaypoint(center[0], center[1], city, countryCode, country);
    lastSearchedCoords.value = newPoint
    const geocoderInputs = document.querySelectorAll('.mapboxgl-ctrl-geocoder--input');
    geocoderInputs[1].blur()
  });
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
}
function setupGeocoderOrigin() {
  geocoderOrigin = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Choisis un point de départ',
    language: 'fr-FR',
    types: 'place',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    marker: {
      color: '#8A4852'
    },
  })
  document.getElementById('geocoder-origin-container').appendChild(geocoderOrigin.onAdd(map))
  geocoderOrigin.on('result', (event) => {
    lastSearchedCoords.value = [];
    const { center } = event.result;
    const city = event.result.text;
    const countryObject = event.result.context.find((item) => item.id.startsWith('country'));
    const country = countryObject.text;
    const countryCode = countryObject.short_code;
    const startPoint = createWaypoint(center[0], center[1], city, countryCode, country);
    lastSearchedCoords.value.push(startPoint);
    if (enableReturnStart.value) {
      const endPoint = createWaypoint(center[0], center[1], city, countryCode, country);
      lastSearchedCoords.value.push(endPoint);
    }
    const geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder--input');
    geocoderInput.blur();
    console.log('geocodeurOn', lastSearchedCoords.value);
  });
}
async function handleGeocoderOrigin() {
  const haveWaypoint = await checkLastSearchValue(lastSearchedCoords.value)

  if (!haveWaypoint) {
    mapEmitter.emit('no-waypoint-origin');
  } else if (haveWaypoint) {
    mapEmitter.emit('have-waypoint-origin')
    waypoints.value = lastSearchedCoords.value;
    geocoderOrigin.clear();
    emit('update-waypoints', waypoints.value);
    const lastCoordLat = waypoints.value[0].lat;
    const lastCoordLon = waypoints.value[0].lon;
    const center = [lastCoordLon, lastCoordLat];
    geojsonMarkerOrigin.features[0].geometry.coordinates = center;
    if (map.getSource('point-start')) {
      map.getSource('point-start').setData(geojsonMarkerOrigin);
      map.getSource('point-label-start').setData(geojsonMarkerOrigin);
    } else {
      map.addLayer(markerCircleStyleOrigin);
      map.addLayer(markerTextStyleOrigin);
    }
    if (enableReturnStart.value) {
      getRoad(waypoints.value);
    }
    lastSearchedCoords.value = [];
    console.log('haveWaypoint', waypoints.value)
  }
}
async function addWaypointFromSearch() {
  geocoder.clear();
  const geocoderInputs = document.querySelectorAll('.mapboxgl-ctrl-geocoder--input');
  geocoderInputs[1].blur();
  const haveWaypoint = await checkLastSearchValue(lastSearchedCoords.value);

  if (lastSearchedCoords.value && haveWaypoint) {

    const waypointExists = waypoints.value.some(waypoint =>
      waypoint.lat === lastSearchedCoords.value.lat &&
      waypoint.lng === lastSearchedCoords.value.lng
    );

    if (!waypointExists) {
      if (waypoints.value.length === 1) {
        waypoints.value.push(lastSearchedCoords.value);
      } else {
        await addWaypoint(lastSearchedCoords.value);
      }
      await getRoad(waypoints.value);
    } else {
      mapEmitter.emit('waypoint-exist');
    }
  } else {
    mapEmitter.emit('no-waypoint');
  }
  lastSearchedCoords.value = [];
}
async function addWaypoint(arrLngLat) {
  if (enableReturnStart.value) {
    insertToMinimizeDistanceLoop(arrLngLat, waypoints.value);
  } else {
    insertToMinimizeDistance(arrLngLat, waypoints.value)
    sortWaypointsByNearestNeighbor(waypoints.value)
  }
}


function handleGetRoadAfterDraggable(newWaypoints) {
  waypoints.value = newWaypoints
  console.log("newWaypoint", newWaypoints)
  emit('update-waypoints', waypoints.value)
  getRoad(newWaypoints)
}
function handleGetRoadAfterDelete(newWaypoints) {
  waypoints.value = newWaypoints
  const ArrPointId = getPointsIdsFromMap(map)
  map.removeLayer('route')
  map.removeSource('route')
  if (waypoints.value.length > 1) {
    for (let i = 1; i < ArrPointId.length; i++) {
      const pointEndId = `point-${i}`;
      const pointLabelEndId = `point-label-${i}`;
      if (map.getLayer(pointEndId)) {
        map.removeLayer(pointEndId);
        map.removeSource(pointEndId);
        map.removeLayer(pointLabelEndId);
        map.removeSource(pointLabelEndId);
      }
    }
    getRoad(waypoints.value);
  }
  else {
    map.removeLayer("point-1")
    map.removeSource("point-1")
    map.removeLayer(`point-label-1`)
    map.removeSource(`point-label-1`)
    console.log(getPointsIdsFromMap(map))
  }
}

// GET ROAD
async function getRoad(waypoints) {
  isLoading.value = true;
  mapEmitter.emit('is-loading', isLoading.value);
  const road = await fetchRoad(waypoints);
  createAndUpdateRoad(road, waypoints);
  addLegDurationDistance(road.legs, waypoints);
  isLoading.value = false;
  mapEmitter.emit('is-loading', isLoading.value);
}
async function fetchRoad(waypoints) {
  const coordinates = waypoints.map(point => `${point.lon},${point.lat}`).join(';');
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  try {
    const json = await query.json();
    return json.routes[0];
  } catch (error) {
    console.error("Error fetching route data:", error);
    return null;
  }
}
function addLegDurationDistance(legs, waypoints) {
  const legDataArray = legs.map(leg => ({
    duration: leg.duration,
    distance: (leg.distance / 1000).toFixed(0)
  }));
  for (let i = 0; i < waypoints.length; i++) {
    if (i < legDataArray.length) {
      waypoints[i].duration = legDataArray[i].duration;
      waypoints[i].distance = legDataArray[i].distance;
    } else {
      waypoints[i].duration = '';
      waypoints[i].distance = '';
    }
  }
}
function createAndUpdateRoad(road, waypoints) {
  const route = road.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  } else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
  for (let index = 0; index < waypoints.length; index++) {
    const point = waypoints[index];
    const pointId = `point-${index}`;
    const labelId = `point-label-${index}`;
    let labelText = index === 0 ? 'Start' :
      index === waypoints.length - 1 ? 'End' :
        (index + 1).toString();
    const pointGeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [point.lon, point.lat]
        }
      }]
    };
    if (map.getLayer(pointId)) {
      map.removeLayer(pointId);
      map.removeSource(pointId);
    }
    map.addLayer({
      id: pointId,
      type: 'circle',
      source: {
        type: 'geojson',
        data: pointGeoJSON
      },
      paint: {
        'circle-radius': index === 0 || index === waypoints.length - 1 ? 12 : 8,
        'circle-color': index === 0 || index === waypoints.length - 1 ? '#8A4852' : '#A86C7A'
      }
    });
    if (map.getLayer(labelId)) {
      map.removeLayer(labelId);
      map.removeSource(labelId);
    }
    map.addLayer({
      id: labelId,
      type: 'symbol',
      source: {
        type: 'geojson',
        data: pointGeoJSON
      },
      layout: {
        'text-field': labelText,
        'text-size': 8,
        'text-font': ['Open Sans Bold']
      },
      paint: {
        'text-color': '#ffffff'
      }
    });
  }
}
</script>
<style scoped>
.map-container {
  width: 100%;
  height: 45vh;
  position: absolute
}

.map-container-full {
  height: 95vh;
}

@media (min-width: 1024px) {
  .map-container {
    height: 100vh;
  }
}
</style>