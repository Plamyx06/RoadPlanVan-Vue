<template>
    <div id="map-container" class=""></div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineEmits  } from 'vue';
  import mapboxgl from 'mapbox-gl';
  import MapboxLanguage from '@mapbox/mapbox-gl-language';
  import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.css';
  import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
  import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
  import '/home/plamyx/Code/RoadPlanVan/src/assets/style/mapbox-gl-geocoder-custom.css';
  import '/home/plamyx/Code/RoadPlanVan/src/mapbox-gl-direction/mapbox-gl-directions.css'
  import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
  import * as turf from '@turf/turf';
  import emitter from '/home/plamyx/Code/RoadPlanVan/src/components/utility/eventBus.js';
 

const emit = defineEmits(["update-waypoints"]);

const lastSearchedCoords = ref(null)
const waypoints = ref([]);



 


  
  onMounted(() => {
      mapboxgl.accessToken = import.meta.env.VITE_APP_API_KEY;
      const map = new mapboxgl.Map({
          container: 'map-container',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [2.3522, 48.8566],
          zoom: 3
      });
  
      map.addControl(new MapboxLanguage({
          defaultLanguage: 'fr'
      }));

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
};

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
};

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
};

 const geocoderOrigin = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Choisis un point de départ",
    language: 'fr-FR',
    types: 'place',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    marker:false,
});
document.getElementById('geocoder-origin-container').appendChild(geocoderOrigin.onAdd(map));

geocoderOrigin.on('result', (event) => {
    const { center } = event.result;
    const city = event.result.text;

    const regionObj = event.result.context.find(item => item.id.startsWith('region'));
    const countryObj = event.result.context.find(item => item.id.startsWith('country'));

    const region = regionObj ? regionObj.text : null;
    const country = countryObj ? countryObj.text : null;

    // Si la région n'est pas définie, affichez seulement le pays. Sinon, affichez région et pays.
    const placeLocation = region ? `${region}, ${country}` : country;

    console.log(`ville : ${city} placeLocation :${placeLocation}`);

    const startPoint = {
        lon: center[0],
        lat: center[1],
        city: city,
        placeLocation: placeLocation
    };
    waypoints.value.push(startPoint);
    emit('update-waypoints', waypoints.value);

    geojsonMarkerOrigin.features[0].geometry.coordinates = center;

    // Si le marqueur et le texte existent déjà sur la carte, mettez à jour leurs données
    if (map.getSource('point-start')) {
        map.getSource('point-start').setData(geojsonMarkerOrigin);
        map.getSource('point-label-start').setData(geojsonMarkerOrigin);
    } else {
        // Sinon, ajoutez le marqueur et le texte à la carte
        map.addLayer(markerCircleStyleOrigin);
        map.addLayer(markerTextStyleOrigin);
    }

    // Émettez l'événement avec les données de la localisation

    console.log(center[1], center[0]);
    console.log(startPoint); // J'ai corrigé `start` par `startPoint`
});







// GEOCODER CLASSIC
const geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken, 

mapboxgl: mapboxgl,
    language: 'fr-FR',
    types: 'place',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    placeholder: "Ajoute une destination",
    flyTo: {
        speed: 1, // Vitesse de transition
        curve: 1,
        zoom: 3, // C'est ici que vous définissez le niveau de zoom final
        essential: true,
    },
    marker: {
        color: '#8A4852',
    }
    
  });
 emitter.on('add-point', addWaypointFromSearch);
function addWaypointFromSearch() {
    console.log("j'ai fonctionné")
    geocoder.clear();
    if (waypoints.value.length === 1 && lastSearchedCoords.value) {
        waypoints.value.push(lastSearchedCoords.value);
        getRoute();

    } else {
        addWaypoint(lastSearchedCoords.value)
        getRoute()
        
    }
}


geocoder.on('result', (event) => {
    const { center } = event.result;
    const city = event.result.text;

    const regionObj = event.result.context.find(item => item.id.startsWith('region'));
    const countryObj = event.result.context.find(item => item.id.startsWith('country'));

    const region = regionObj ? regionObj.text : null;
    const country = countryObj ? countryObj.text : null;

    // Si la région n'est pas définie, affichez seulement le pays. Sinon, affichez région et pays.
    const placeLocation = region ? `${region}, ${country}` : country;

    console.log(`ville : ${city} placeLocation :${placeLocation}`);

    const newPoint = {
        lon: center[0],
        lat: center[1],
        city: city,
        placeLocation: placeLocation
    };
    lastSearchedCoords.value = newPoint
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

  
// API DIRECTION 

function getCoordinates(point) {
    return [point.lon, point.lat];
}

async function getRoute() {
    const coordinates = waypoints.value.map(point => `${point.lon},${point.lat}`).join(";");

      const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
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
  
      for (let index = 0; index < waypoints.value.length; index++) {
          const point = waypoints.value[index];
  console.log("je suis poin" , point)
          // Remove the old waypoints layer if it exists
          if (map.getLayer(`point-${index}`)) {
              map.removeLayer(`point-${index}`);
              map.removeSource(`point-${index}`);
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
                                  coordinates: getCoordinates(point)
                              }
                          }
                      ]
                  }
              },
              paint: {
                  'circle-radius': index === 0 || index === waypoints.value.length - 1 ? 12 : 8,
                  'circle-color': index === 0 || index === waypoints.value.length - 1 ? '#8A4852' : '#A86C7A'
              }
          });
  
          let labelText;
          if (index === 0) {
              labelText = "Start";
          } else if (index === waypoints.value.length - 1) {
              labelText = "End";
          } else {
              labelText = (index + 1).toString();
          }
  
          // Check if layer with text exists and remove it if it does
          if (map.getLayer(`point-label-${index}`)) {
              map.removeLayer(`point-label-${index}`);
              map.removeSource(`point-label-${index}`);
          }
  
          // Add layer for the text label
          map.addLayer({
              id: `point-label-${index}`,
              type: 'symbol',
              source: {
                  type: 'geojson',
                  data: {
                      type: 'FeatureCollection',
                      features: [{
                          type: 'Feature',
                          properties: {
                              number: labelText  // Using the computed labelText
                          },
                          geometry: {
    type: 'Point',
    coordinates: getCoordinates(point)
}

                      }]
                  }
              },
              layout: {
                  'text-field': '{number}',  // Referencing the number property
                  'text-size': 8,
                  'text-font': ['Open Sans Bold']
              },
              paint: {
                  'text-color': '#ffffff'  // Text color as white
              }
          });
      }
  }

  async function addWaypoint(arrLngLat) {
    if (!arrLngLat || typeof arrLngLat !== 'object' || !arrLngLat.lon || !arrLngLat.lat) {
        console.error('arrLngLat is invalid:', arrLngLat);
        return;
    }

    console.log("arrLngLat:", arrLngLat);

    // Utilisez directement arrLngLat car il est déjà un objet avec des propriétés lon et lat
    insertToMinimizeDistance(arrLngLat);
    sortWaypointsByNearestNeighbor();
}


function insertToMinimizeDistance(newWaypoint) {
    let minimalAddedDistance = Infinity;
    let optimalInsertPosition = 1;

    for (let i = 0; i < waypoints.value.length - 1; i++) {
        const distanceBeforeInsert = turf.distance(turf.point([waypoints.value[i].lon, waypoints.value[i].lat]), turf.point([waypoints.value[i + 1].lon, waypoints.value[i + 1].lat]));
        const distanceAfterInsert = turf.distance(turf.point([waypoints.value[i].lon, waypoints.value[i].lat]), turf.point([newWaypoint.lon, newWaypoint.lat])) +
            turf.distance(turf.point([newWaypoint.lon, newWaypoint.lat]), turf.point([waypoints.value[i + 1].lon, waypoints.value[i + 1].lat]));

        const addedDistance = distanceAfterInsert - distanceBeforeInsert;

        if (addedDistance < minimalAddedDistance) {
            minimalAddedDistance = addedDistance;
            optimalInsertPosition = i + 1;
        }
    }

    waypoints.value.splice(optimalInsertPosition, 0, newWaypoint);
}


function sortWaypointsByNearestNeighbor() {
    const orderedWaypoints = [waypoints.value[0]];
    const remainingWaypoints = waypoints.value.slice(1);

    while (remainingWaypoints.length > 0) {
        const lastPoint = orderedWaypoints[orderedWaypoints.length - 1];
        let nearestPointIndex = 0;
        let shortestDistance = turf.distance(turf.point([lastPoint.lon, lastPoint.lat]), turf.point([remainingWaypoints[0].lon, remainingWaypoints[0].lat]));

        for (let i = 1; i < remainingWaypoints.length; i++) {
            const currentDistance = turf.distance(turf.point([lastPoint.lon, lastPoint.lat]), turf.point([remainingWaypoints[i].lon, remainingWaypoints[i].lat]));
            if (currentDistance < shortestDistance) {
                nearestPointIndex = i;
                shortestDistance = currentDistance;
            }
        }

        orderedWaypoints.push(remainingWaypoints.splice(nearestPointIndex, 1)[0]);
    }

    waypoints.value.length = 0;
    waypoints.value.push(...orderedWaypoints);
    console.log('waypoint : ',waypoints.value)
}

  
  
  
  
  

  })
  </script>
  
  <style scoped>
  #map-container {
    width: 100%;
    height: 100vh;
    position: absolute;
  }
  </style>