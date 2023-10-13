<template>
  <div id="map-container" class="w-full"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.css';
import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
import '/home/plamyx/Code/RoadPlanVan/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '/home/plamyx/Code/RoadPlanVan/src/assets/style/mapbox-gl-geocoder-custom.css';
import '/home/plamyx/Code/RoadPlanVan/src/mapbox-gl-direction/mapbox-gl-directions.css'
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from '@turf/turf';

const start = [7.2620, 43.7102];
const end = [2.3522, 48.8566];
const waypoints = [start, end];

onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_APP_API_KEY;
    const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: start,
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
    interactive: false,
    geocoder: {
      bbox: [-31.266001, 27.636311, 40.190342, 81.281509],
    },
    controls: {
      instructions: false,
      marker: false
    },
    placeholderOrigin: 'Lieu de départ',
    placeholderDestination: 'Lieux à visiter ',
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
                'text-field': 'Start',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 8
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
                'text-field': 'End',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 8
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

const arrLocationStart = route.legs[0].steps[0].maneuver
.location
const arrLocationEnd = route.legs[0].steps[route.legs[0].steps.length - 1].maneuver.location;
console.log(route.legs[0].steps[route.legs[0].steps.length - 1])


async function fetchMapboxGeocoding( longitude, latitude) {
  try {
    const url =`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
        const response = await fetch(url);
      
      if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const places = data.features.filter(feature => feature.id.includes("place"));
        
return places[0].place_name}
        catch (error) {
        console.error("There was a problem with the fetch operation:", error.message);
    }
}

const longitudeStart = arrLocationStart[0];
const latitudeStart = arrLocationStart[1];

const longitudeEnd = arrLocationEnd[0]
const latitudeEnd = arrLocationEnd[1]

fetchMapboxGeocoding(longitudeStart, latitudeStart).then(placeName => {
  placeNameStart.value= placeName
    console.log(placeName);
});
 fetchMapboxGeocoding(longitudeEnd, latitudeEnd).then(placeName => {
  placeNameEnd.value= placeName
    console.log(placeName);
});

});

document.getElementById('direction').appendChild(directions.onAdd(map));


const geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken, 

mapboxgl: mapboxgl,
    language: 'fr-FR',
    types: 'place',
    bbox: [-31.266001, 27.636311, 69.033946, 81.008797],
    marker: {
color: 'orange'
},
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

    
   /* latitude.value = center[1];
    longitude.value = center[0];
    placeName.value =`${text}`
    placeLocation.value = city ? `${city}, ${country}` : `${country}`;*/
    console.log(center[1],center[0])

});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    async function getRoute() {
    const coordinates = waypoints.map(point => point.join(",")).join(";");
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

    for (let index = 0; index < waypoints.length; index++) {
        const point = waypoints[index];

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
                                coordinates: point
                            }
                        }
                    ]
                }
            },
            paint: {
                'circle-radius': index === 0 || index === waypoints.length - 1 ? 12 : 8,
                'circle-color': index === 0 || index === waypoints.length - 1 ? '#8A4852' : '#A86C7A'
            }
        });

        let labelText;
        if (index === 0) {
            labelText = "Start";
        } else if (index === waypoints.length - 1) {
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
                            coordinates: point
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
    async function addWaypoint(event) {
    const newWaypoint = [event.lngLat.lng, event.lngLat.lat];
    insertToMinimizeDistance(newWaypoint);
    sortWaypointsByNearestNeighbor();
}
function insertToMinimizeDistance(newWaypoint) {
    let minimalAddedDistance = Infinity;
    let optimalInsertPosition = 1;

    for (let i = 0; i < waypoints.length - 1; i++) {
        const distanceBeforeInsert = turf.distance(turf.point(waypoints[i]), turf.point(waypoints[i+1]));
        const distanceAfterInsert = turf.distance(turf.point(waypoints[i]), turf.point(newWaypoint)) + 
                                    turf.distance(turf.point(newWaypoint), turf.point(waypoints[i+1]));

        const addedDistance = distanceAfterInsert - distanceBeforeInsert;

        if (addedDistance < minimalAddedDistance) {
            minimalAddedDistance = addedDistance;
            optimalInsertPosition = i + 1;
        }
    }

    waypoints.splice(optimalInsertPosition, 0, newWaypoint);
}
// Cette nouvelle fonction essaye chaque permutation de waypoints pour trouver celle qui a la distance totale minimale.
function sortWaypointsByNearestNeighbor() {
    const orderedWaypoints = [waypoints[0]];
    const remainingWaypoints = waypoints.slice(1);

    while (remainingWaypoints.length > 0) {
        const lastPoint = orderedWaypoints[orderedWaypoints.length - 1];
        let nearestPointIndex = 0;
        let shortestDistance = turf.distance(turf.point(lastPoint), turf.point(remainingWaypoints[0]));

        for (let i = 1; i < remainingWaypoints.length; i++) {
            const currentDistance = turf.distance(turf.point(lastPoint), turf.point(remainingWaypoints[i]));
            if (currentDistance < shortestDistance) {
                nearestPointIndex = i;
                shortestDistance = currentDistance;
            }
        }

        orderedWaypoints.push(remainingWaypoints.splice(nearestPointIndex, 1)[0]);
    }

    waypoints.length = 0;
    waypoints.push(...orderedWaypoints);
}






    map.on('load', async () => {
        await getRoute();
        map.on('click', async (event) => {
            await addWaypoint(event);
            await getRoute();
        });
    });
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: absolute;
}
</style>
