<template>
  <div id="map-container">
  </div>
  <div v-if="isLoading" class="absolute top-0 w-full h-2/5 bg-gray-500 bg-opacity-40 flex justify-center items-center">
    <Spinner class="w-20 h-20" />
  </div>
</template>


<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import '../assets/style/mapbox-gl-geocoder-custom.css'
import '../mapbox-gl-direction/mapbox-gl-directions.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import * as turf from '@turf/turf'
import emitter from '../components/utility/eventBus.js'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner.vue'

const emit = defineEmits(['update-waypoints'])

const lastSearchedCoords = ref([])
const waypoints = ref([])
const enabledLoop = ref(true);
const isLoading = ref(false)


emitter.on('enabled-loop', (enabledValue) => {
  enabledLoop.value = enabledValue
});



onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_APP_API_KEY
  const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [2.3522, 48.8566],
    zoom: 3
  })

  map.addControl(
    new MapboxLanguage({
      defaultLanguage: 'fr'
    })
  )

  // GEOCODER ORIGN
  const geojsonMarkerOrigin = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          number: 'Start'
        },
        geometry: {
          type: 'Point',
          coordinates: waypoints[0]
        }
      }
    ]
  }

  const markerCircleStyleOrigin = {
    id: 'point-start',
    type: 'circle',
    source: {
      type: 'geojson',
      data: geojsonMarkerOrigin
    },
    paint: {
      'circle-radius': 12,
      'circle-color': '#8A4852'
    }
  }

  const markerTextStyleOrigin = {
    id: 'point-label-start',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: geojsonMarkerOrigin
    },
    layout: {
      'text-field': '{number}',
      'text-size': 8,
      'text-font': ['Open Sans Bold']
    },
    paint: {
      'text-color': '#ffffff'
    }
  }

  const geocoderOrigin = new MapboxGeocoder({
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
    const { center } = event.result
    const city = event.result.text

    const countryObject = event.result.context.find((item) => item.id.startsWith('country'))
    const country = countryObject.text
    const countryCode = countryObject.short_code

    const startPoint = {
      id: uuidv4(),
      lon: center[0],
      lat: center[1],
      city: city,
      countryCode: countryCode.toUpperCase(),
      country: country
    }
    lastSearchedCoords.value.push(startPoint)
    if (enabledLoop.value) {
      const EndPoint = {
        id: uuidv4(),
        lon: center[0],
        lat: center[1],
        city: city,
        countryCode: countryCode.toUpperCase(),
        country: country
      }
      lastSearchedCoords.value.push(EndPoint)
    }


  })


  emitter.on('updated-waypoint-origin', handleGeocoderOrigin)
  function handleGeocoderOrigin() {
    if (!lastSearchedCoords.value || lastSearchedCoords.value.length === 0 || !lastSearchedCoords.value[0].lat) {
      emitter.emit('no-waypoint-origin');
      console.log('Aucun point de départ défini');
    }
    else {
      geocoderOrigin.clear();
      waypoints.value = lastSearchedCoords.value
      emit('update-waypoints', waypoints.value)

      const lastCoordLat = waypoints.value[0].lat
      const lastCoordLon = waypoints.value[0].lon
      const center = [lastCoordLon, lastCoordLat];
      geojsonMarkerOrigin.features[0].geometry.coordinates = center
      if (map.getSource('point-start')) {
        map.getSource('point-start').setData(geojsonMarkerOrigin)
        map.getSource('point-label-start').setData(geojsonMarkerOrigin)
      } else {
        map.addLayer(markerCircleStyleOrigin)
        map.addLayer(markerTextStyleOrigin)
      }
      lastSearchedCoords.value = null
      if (enabledLoop.value) {
        getRoad(waypoints.value)
      }
    }
  }

  emitter.on('get-road-draggable', handleGetRoadDraggable)
  function handleGetRoadDraggable(newWaypoints) {
    waypoints.value = newWaypoints
    getRoad(newWaypoints)
  }

  emitter.on('get-road-delete', handleGetRoadDelete)
  function handleGetRoadDelete(newWaypoints) {
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
  function getPointsIdsFromMap(map) {
    const layers = map.getStyle().layers;
    const pointDetails = [];

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.id.startsWith('point-label')) {
        const layerDetails = {
          id: layer,
        };
        pointDetails.push(layerDetails);
      }
    }

    return pointDetails;
  }




  // GEOCODER CLASSIC
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,

    mapboxgl: mapboxgl,
    language: 'fr-FR',
    types: 'place',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    placeholder: 'Ajoute une destination',
    flyTo: {
      speed: 1,
      curve: 1,
      zoom: 3,
      essential: true
    },
    marker: {
      color: '#8A4852'
    }
  })

  emitter.on('add-point', addWaypointFromSearch)
  function addWaypointFromSearch() {
    geocoder.clear();
    if (lastSearchedCoords.value) {
      const waypointExists = waypoints.value.some(waypoint =>
        waypoint.lat === lastSearchedCoords.value.lat &&
        waypoint.lng === lastSearchedCoords.value.lng
      );

      if (!waypointExists) {
        if (waypoints.value.length === 1) {
          waypoints.value.push(lastSearchedCoords.value);
          getRoad(waypoints.value);
        } else {
          addWaypoint(lastSearchedCoords.value);
          getRoad(waypoints.value);
        }
        lastSearchedCoords.value = null;
      } else {
        emitter.emit('waypointExist');
        lastSearchedCoords.value = null;
      }
    } else {
      emitter.emit('noWaypoint');
    }
  }

  geocoder.on('result', (event) => {
    const { center } = event.result
    const city = event.result.text


    const countryObject = event.result.context.find((item) => item.id.startsWith('country'))
    const country = countryObject.text
    const countryCode = countryObject.short_code



    const newPoint = {
      id: uuidv4(),
      lon: center[0],
      lat: center[1],
      city: city,
      countryCode: countryCode,
      country: country
    }
    lastSearchedCoords.value = newPoint
  })
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map))

  // API DIRECTION  
  async function getRoad(waypoints) {
    isLoading.value = true
    emitter.emit('isLoading', isLoading.value);
    const coordinates = waypoints.map((point) => `${point.lon},${point.lat}`).join(';')

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    )

    const json = await query.json()
    const data = json.routes[0]
    const route = data.geometry.coordinates
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
      if (map.getLayer(`point-${index}`)) {
        map.removeLayer(`point-${index}`)
        map.removeSource(`point-${index}`)
      }

      map.addLayer({
        id: `point-${index}`,
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
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
        },
        paint: {
          'circle-radius': index === 0 || index === waypoints.length - 1 ? 12 : 8,
          'circle-color': index === 0 || index === waypoints.length - 1 ? '#8A4852' : '#A86C7A'
        }
      })

      let labelText
      if (index === 0) {
        labelText = 'Start'
      } else if (index === waypoints.length - 1) {
        labelText = 'End'
      } else {
        labelText = (index + 1).toString()
      }

      if (map.getLayer(`point-label-${index}`)) {
        map.removeLayer(`point-label-${index}`)
        map.removeSource(`point-label-${index}`)
      }

      map.addLayer({
        id: `point-label-${index}`,
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  number: labelText
                },
                geometry: {
                  type: 'Point',
                  coordinates: [point.lon, point.lat]
                }
              }
            ]
          }
        },
        layout: {
          'text-field': '{number}',
          'text-size': 8,
          'text-font': ['Open Sans Bold']
        },
        paint: {
          'text-color': '#ffffff'
        }
      })
    }

    const legDataArray = [];

    for (const leg of data.legs) {
      const duration = leg.duration;
      const distance = (leg.distance / 1000).toFixed(0);

      const legObj = {
        duration: duration,
        distance: distance
      };

      legDataArray.push(legObj);
    }
    for (let i = 0; i < waypoints.length; i++) {
      if (i < legDataArray.length) {

        waypoints[i].duration = legDataArray[i].duration;
        waypoints[i].distance = legDataArray[i].distance;
      } else {
        waypoints[i].duration = '';
        waypoints[i].distance = '';
      }
    }
    isLoading.value = false
    emitter.emit('isLoading', isLoading.value);
  }
  async function addWaypoint(arrLngLat) {
    if (!arrLngLat || typeof arrLngLat !== 'object' || !arrLngLat.lon || !arrLngLat.lat) {
      console.error('arrLngLat is invalid:', arrLngLat)
      return
    }
    if (enabledLoop.value) {
      insertToMinimizeDistanceLoop(arrLngLat);
    } else {
      insertToMinimizeDistance(arrLngLat)
      sortWaypointsByNearestNeighbor()
    }
  }
  function insertToMinimizeDistanceLoop(newWaypoint) {
    let minimalAddedDistance = Infinity;
    let optimalInsertPosition = 1;

    for (let i = 0; i < waypoints.value.length; i++) {
      const distanceBeforeInsert = turf.distance(
        turf.point([waypoints.value[i].lon, waypoints.value[i].lat]),
        turf.point([waypoints.value[(i + 1) % waypoints.value.length].lon, waypoints.value[(i + 1) % waypoints.value.length].lat])
      );
      const distanceAfterInsert =
        turf.distance(
          turf.point([waypoints.value[i].lon, waypoints.value[i].lat]),
          turf.point([newWaypoint.lon, newWaypoint.lat])
        ) +
        turf.distance(
          turf.point([newWaypoint.lon, newWaypoint.lat]),
          turf.point([waypoints.value[(i + 1) % waypoints.value.length].lon, waypoints.value[(i + 1) % waypoints.value.length].lat])
        );

      const addedDistance = distanceAfterInsert - distanceBeforeInsert;

      if (addedDistance < minimalAddedDistance) {
        minimalAddedDistance = addedDistance;
        optimalInsertPosition = i + 1;
      }
    }

    waypoints.value.splice(optimalInsertPosition, 0, newWaypoint);
  }
  function insertToMinimizeDistance(newWaypoint) {
    let minimalAddedDistance = Infinity
    let optimalInsertPosition = 1

    for (let i = 0; i < waypoints.value.length - 1; i++) {
      const distanceBeforeInsert = turf.distance(
        turf.point([waypoints.value[i].lon, waypoints.value[i].lat]),
        turf.point([waypoints.value[i + 1].lon, waypoints.value[i + 1].lat])
      )
      const distanceAfterInsert =
        turf.distance(
          turf.point([waypoints.value[i].lon, waypoints.value[i].lat]),
          turf.point([newWaypoint.lon, newWaypoint.lat])
        ) +
        turf.distance(
          turf.point([newWaypoint.lon, newWaypoint.lat]),
          turf.point([waypoints.value[i + 1].lon, waypoints.value[i + 1].lat])
        )

      const addedDistance = distanceAfterInsert - distanceBeforeInsert

      if (addedDistance < minimalAddedDistance) {
        minimalAddedDistance = addedDistance
        optimalInsertPosition = i + 1
      }
    }

    waypoints.value.splice(optimalInsertPosition, 0, newWaypoint)
  }
  function sortWaypointsByNearestNeighbor() {
    const orderedWaypoints = [waypoints.value[0]];
    const remainingWaypoints = waypoints.value.slice(1);

    const sortRecursively = (lastPoint, remaining) => {
      if (remaining.length === 0) {
        return;
      }

      let nearestPointIndex = 0;
      let shortestDistance = turf.distance(
        turf.point([lastPoint.lon, lastPoint.lat]),
        turf.point([remaining[0].lon, remaining[0].lat])
      );

      for (let i = 1; i < remaining.length; i++) {
        const currentDistance = turf.distance(
          turf.point([lastPoint.lon, lastPoint.lat]),
          turf.point([remaining[i].lon, remaining[i].lat])
        );
        if (currentDistance < shortestDistance) {
          nearestPointIndex = i;
          shortestDistance = currentDistance;
        }
      }

      orderedWaypoints.push(remaining.splice(nearestPointIndex, 1)[0]);
      sortRecursively(orderedWaypoints[orderedWaypoints.length - 1], remaining);
    };

    sortRecursively(orderedWaypoints[0], remainingWaypoints);

    waypoints.value.length = 0;
    waypoints.value.push(...orderedWaypoints);
    console.log('waypoint : ', waypoints.value);
  }


})
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 60vh;
  position: absolute;
}
</style>
