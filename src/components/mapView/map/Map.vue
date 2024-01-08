<script setup>
import { ref, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import Spinner from '@/components/mapView/Spinner.vue'
import mapEmitter from '@/components/mapView/mapEvent.js'
import cuid from 'cuid'
import {
  insertToMinimizeDistance,
  sortWaypointsByNearestNeighbor
} from '@/components/mapView/map/utils/tspSolver.js'
import {
  getGeojsonMarkerOrigin,
  getMarkerCircleStyleOrigin,
  getMarkerTextStyleOrigin
} from '@/components/mapView/map/style/markerOrigin.js'
import {
  handleResize,
  createWaypoint,
  checkLastSearchValue,
  getPointsIdsFromMap
} from '@/components/mapView/map/utils/utility.js'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import '@/components/mapView/map/style/mapbox-gl-geocoder-custom.css'
import '@/components/mapView/map/style/mapbox-gl-directions-custom.css'

const lastSearchedCoords = ref([])
const waypoints = ref([])
const returnToStartingWaypoint = ref(true)
const isLoading = ref(false)
const isFullSize = ref(false)

let map
let geocoderOrigin
let geocoder

// Marker Style
const geojsonMarkerOrigin = getGeojsonMarkerOrigin(waypoints)
const markerCircleStyleOrigin = getMarkerCircleStyleOrigin(geojsonMarkerOrigin)
const markerTextStyleOrigin = getMarkerTextStyleOrigin(geojsonMarkerOrigin)

onMounted(() => {
  initializeMap()
  setupGeocoder()
  setupGeocoderOrigin()
  const storedWaypoints = JSON.parse(localStorage.getItem('itinerary-waypoints'))
  if (storedWaypoints !== null) {
    waypoints.value = storedWaypoints
    getRoad(waypoints.value)
  }
})

// Emitter Event Handlers
mapEmitter.on('return-to-starting-waypoint', (value) => (returnToStartingWaypoint.value = value))
mapEmitter.on('resize-map', () => handleResize(map, isFullSize))
mapEmitter.on('add-waypoint-origin', async () => await handleGeocoderOrigin())
mapEmitter.on('get-road-draggable', handleGetRoadAfterDraggable)
mapEmitter.on('get-road-delete', handleGetRoadAfterDelete)
mapEmitter.on('add-point', async () => await addWaypointFromSearch())
mapEmitter.on('reset-roadtrip', handleResetRoadTrip)
mapEmitter.on('delete-end-waypoints', handleDeleteEndPoint)
mapEmitter.on('add-end-waypoints', async () => await handleAddEndWaypoints())
mapEmitter.on('sort-waypoints', async () => await getOptimizedTrip(waypoints.value))

function initializeMap() {
  mapboxgl.accessToken = import.meta.env.VITE_APP_API_KEY
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [2.3522, 48.8566],
    zoom: 3,
    attributionControl: false
  })
  map.addControl(new MapboxLanguage({ defaultLanguage: 'fr' }))
}

//GEOCODEUR
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
    }
  })
  document.getElementById('geocoder-origin-container').appendChild(geocoderOrigin.onAdd(map))
  geocoderOrigin.on('result', (event) => {
    lastSearchedCoords.value = []
    const { center } = event.result
    const city = event.result.text
    const countryObject = event.result.context.find((item) => item.id.startsWith('country'))
    const country = countryObject.text
    const countryCode = countryObject.short_code
    const startPoint = createWaypoint(center[0], center[1], city, countryCode, country)
    lastSearchedCoords.value.push(startPoint)
    if (returnToStartingWaypoint.value) {
      const endPoint = createWaypoint(center[0], center[1], city, countryCode, country)
      lastSearchedCoords.value.push(endPoint)
    }
    const geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder--input')
    geocoderInput.blur()
  })
}
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
  })
  geocoder.on('result', (event) => {
    const { center } = event.result
    const city = event.result.text
    const countryObject = event.result.context.find((item) => item.id.startsWith('country'))
    const country = countryObject.text
    const countryCode = countryObject.short_code
    const newPoint = createWaypoint(center[0], center[1], city, countryCode, country)
    lastSearchedCoords.value = newPoint
    const geocoderInputs = document.querySelectorAll('.mapboxgl-ctrl-geocoder--input')
    geocoderInputs[1].blur()
  })
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map))
}

async function handleGeocoderOrigin() {
  const haveWaypoint = await checkLastSearchValue(lastSearchedCoords.value)
  if (!haveWaypoint) {
    mapEmitter.emit('no-waypoint-origin')
  } else if (haveWaypoint) {
    mapEmitter.emit('have-waypoint-origin')
    waypoints.value = lastSearchedCoords.value
    geocoderOrigin.clear()
    const lastCoordLat = waypoints.value[0].lat
    const lastCoordLon = waypoints.value[0].lon
    const center = [lastCoordLon, lastCoordLat]
    geojsonMarkerOrigin.features[0].geometry.coordinates = center
    if (map.getSource('point-start')) {
      map.getSource('point-start').setData(geojsonMarkerOrigin)
      map.getSource('point-label-start').setData(geojsonMarkerOrigin)
    } else {
      map.addLayer(markerCircleStyleOrigin)
      map.addLayer(markerTextStyleOrigin)
    }
    if (returnToStartingWaypoint.value) {
      await getRoad(waypoints.value)
    }
    lastSearchedCoords.value = []
    localStorageSetItem('itinerary-waypoints', waypoints.value)
  }
}
async function addWaypointFromSearch() {
  geocoder.clear()
  const geocoderInputs = document.querySelectorAll('.mapboxgl-ctrl-geocoder--input')
  geocoderInputs[1].blur()
  const haveWaypoint = await checkLastSearchValue(lastSearchedCoords.value)
  if (lastSearchedCoords.value && haveWaypoint) {
    const waypointExists = waypoints.value.some(
      (waypoint) =>
        waypoint.lat === lastSearchedCoords.value.lat &&
        waypoint.lng === lastSearchedCoords.value.lng
    )
    if (!waypointExists) {
      if (waypoints.value.length === 1) {
        waypoints.value.push(lastSearchedCoords.value)
      } else {
        await addWaypoint(lastSearchedCoords.value)
      }
      const result = await getRoad(waypoints.value)
      if (result === true) {
        localStorageSetItem('itinerary-waypoints', waypoints.value)
      } else {
        console.log('blue', result)
        localStorageSetItem('itinerary-waypoints', result)
      }
    } else {
      mapEmitter.emit('waypoint-exist')
    }
  } else if (lastSearchedCoords.value.lengh === 0) {
    mapEmitter.emit('no-waypoint')
  }
}
async function addWaypoint(lastCoord) {
  if (returnToStartingWaypoint.value) {
    const endPoint = waypoints.value.pop()
    waypoints.value.push(lastCoord)
    waypoints.value.push(endPoint)
  } else {
    insertToMinimizeDistance(lastCoord, waypoints.value)
    sortWaypointsByNearestNeighbor(waypoints.value)
  }
}
function handleDeleteEndPoint() {
  waypoints.value.pop()
  if (map.getLayer('point-1')) {
    map.removeLayer('point-1')
    map.removeSource('point-1')
    map.removeLayer('point-label-1')
    map.removeSource('point-label-1')
  }

  if (waypoints.value.length > 1) {
    getRoad(waypoints.value)
  }
  localStorageSetItem('itinerary-waypoints', waypoints.value)
}
async function handleAddEndWaypoints() {
  if (waypoints.value.length > 0) {
    const startPoint = { ...waypoints.value[0] }
    startPoint.id = cuid()
    waypoints.value.push(startPoint)
    await getRoad(waypoints.value)
    localStorageSetItem('itinerary-waypoints', waypoints.value)
  }
}
function handleResetRoadTrip() {
  localStorage.removeItem('itinerary-waypoints')
  mapEmitter.emit('updated-waypoints-storage')
  for (let index = 0; index < waypoints.value.length; index++) {
    const pointId = `point-${index}`
    const labelId = `point-label-${index}`
    if (map.getLayer(pointId)) {
      map.removeLayer(pointId)
      map.removeSource(pointId)
    }
    if (map.getLayer(labelId)) {
      map.removeLayer(labelId)
      map.removeSource(labelId)
    }
  }
  const routeId = 'route'
  if (map.getLayer(routeId)) {
    map.removeLayer(routeId)
    map.removeSource(routeId)
  }
  if (map.getLayer('point-start')) {
    map.removeLayer('point-start')
  }
  if (map.getLayer('point-end')) {
    map.removeLayer('point-end')
    map.removeSource('point-label-end')
  }
  waypoints.value = []
}
async function handleGetRoadAfterDraggable(newWaypoints) {
  waypoints.value = newWaypoints
  await getRoad(newWaypoints)
  localStorageSetItem('itinerary-waypoints', newWaypoints)
}
function handleGetRoadAfterDelete(newWaypoints) {
  waypoints.value = newWaypoints
  const ArrPointId = getPointsIdsFromMap(map)
  map.removeLayer('route')
  map.removeSource('route')
  if (waypoints.value.length > 1) {
    for (let i = 1; i < ArrPointId.length; i++) {
      const pointEndId = `point-${i}`
      const pointLabelEndId = `point-label-${i}`
      if (map.getLayer(pointEndId)) {
        map.removeLayer(pointEndId)
        map.removeSource(pointEndId)
        map.removeLayer(pointLabelEndId)
        map.removeSource(pointLabelEndId)
      }
    }
    getRoad(waypoints.value)
  } else {
    map.removeLayer('point-1')
    map.removeSource('point-1')
    map.removeLayer(`point-label-1`)
    map.removeSource(`point-label-1`)
  }
  localStorageSetItem('itinerary-waypoints', waypoints.value)
}

// OPTIMIZATION V1
async function getOptimizedTrip(waypoints) {
  updateLoadingValue(true)
  waypoints = await fetchOptimizedTrip(waypoints)
  await getRoad(waypoints)
  localStorageSetItem('itinerary-waypoints', waypoints)
  updateLoadingValue(false)
}
async function fetchOptimizedTrip(waypoints) {
  const clonedWaypoints = [...waypoints]
  const lastCity = clonedWaypoints.pop()
  const coordinates = clonedWaypoints.map((point) => `${point.lon},${point.lat}`).join(';')
  const query = await fetch(
    `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?roundtrip=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  )

  try {
    const json = await query.json()
    if (json.code !== 'Ok') {
      console.error('Error fetching route data:', json.message)
      return null
    }
    const waypointsWithIndex = json.waypoints

    for (let i = 0; i < clonedWaypoints.length; i++) {
      const waypointWithIndex = waypointsWithIndex[i].waypoint_index
      clonedWaypoints[i].waypointIndex = waypointWithIndex
    }
    clonedWaypoints.sort((a, b) => a.waypointIndex - b.waypointIndex)
    clonedWaypoints.push(lastCity)
    return clonedWaypoints
  } catch (error) {
    console.error('Error fetching route data:', error)
    return null
  }
}

// GET ROAD
async function getRoad(waypoints) {
  updateLoadingValue(true)
  const road = await fetchRoad(waypoints)
  if (road === undefined) {
    const idToRemove = lastSearchedCoords.value.id
    const waypointsFilter = waypoints.filter((waypoint) => waypoint.id !== idToRemove)
    mapEmitter.emit('no-road-for-waypoints')
    updateLoadingValue(false)
    return waypointsFilter
  }
  createAndUpdateRoad(road, waypoints)
  addLegDurationDistance(road.legs, waypoints)
  updateLoadingValue(false)
  return true
}
async function fetchRoad(waypoints) {
  const coordinates = waypoints.map((point) => `${point.lon},${point.lat}`).join(';')
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?alternatives=true&geometries=geojson&language=en&overview=full&&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  )
  try {
    const json = await query.json()
    return json.routes[0]
  } catch (error) {
    console.error('Error fetching route data:', error)
    return null
  }
}
function addLegDurationDistance(legs, waypoints) {
  const legDataArray = legs.map((leg) => ({
    duration: leg.duration,
    distance: (leg.distance / 1000).toFixed(0)
  }))
  for (let i = 0; i < waypoints.length; i++) {
    if (i < legDataArray.length) {
      waypoints[i].duration = legDataArray[i].duration
      waypoints[i].distance = legDataArray[i].distance
    } else {
      waypoints[i].duration = ''
      waypoints[i].distance = ''
    }
  }
}
function createAndUpdateRoad(road, waypoints) {
  const route = road.geometry.coordinates
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  }
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson)
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
    })
  }
  for (let index = 0; index < waypoints.length; index++) {
    const point = waypoints[index]
    const pointId = `point-${index}`
    const labelId = `point-label-${index}`
    let labelText =
      index === 0 ? 'Start' : index === waypoints.length - 1 ? 'End' : (index + 1).toString()
    const pointGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [point.lon, point.lat]
          }
        }
      ]
    }
    if (map.getLayer(pointId)) {
      map.removeLayer(pointId)
      map.removeSource(pointId)
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
    })
    if (map.getLayer(labelId)) {
      map.removeLayer(labelId)
      map.removeSource(labelId)
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
    })
  }
}
// UTILS
function localStorageSetItem(storageKey, data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
    mapEmitter.emit('updated-waypoints-storage')
  } catch (error) {
    console.error(error)
  }
}
function updateLoadingValue(isLoadingValue) {
  isLoading.value = isLoadingValue
  mapEmitter.emit('is-loading', isLoading.value)
}
</script>

<template>
  <div id="map" :class="['map-container', { 'map-full': !isFullSize, 'map-container-full': isFullSize }]"></div>
  <div v-if="isLoading"
    class="absolute top-0 w-full h-[45vh] bg-gray-500 bg-opacity-40 flex justify-center items-center lg:h-full">
    <Spinner class="w-20 h-20 lg:w-40 lg:h-40" />
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 45vh;
  position: absolute;
}

.map-container-full {
  height: 100vh;
}

@media (min-width: 1024px) {
  .map-container {
    height: 100vh;
  }
}
</style>
