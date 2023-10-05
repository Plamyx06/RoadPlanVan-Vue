<template>
  <div id="map-container" class="w-full"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import '/home/plamyx/Code/RoadPlanVan/node_modules/mapbox-gl/dist/mapbox-gl.css';
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

        for (const [index, point] of waypoints.entries()) {
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
            'circle-radius': index === 0 || index === waypoints.length - 1 ? 10 : 7,
            'circle-color': index === 0 || index === waypoints.length - 1 ? '#3887be' : '#ffa500'
        }
    });
}

    }
    async function addWaypoints(event) {
    const newWaypoint = [event.lngLat.lng, event.lngLat.lat];

    if (waypoints.length == 2) {
        // Si c'est le premier waypoint à être ajouté
        const distanceToStart = turf.distance(turf.point(newWaypoint), turf.point(start));
        const distanceToEnd = turf.distance(turf.point(newWaypoint), turf.point(end));

        if (distanceToStart < distanceToEnd) {
            waypoints.splice(1, 0, newWaypoint);  // Ajoutez avant Paris
        } else {
            waypoints.push(newWaypoint);  // Ajoutez après Paris
        }
    } else {
        waypoints.push(newWaypoint);  // Ajoutez d'abord le nouveau waypoint

        // Triez les waypoints (à l'exception du point de départ et de la destination) en fonction de leur distance par rapport au point de départ
        const sortedWaypoints = waypoints.slice(1, waypoints.length - 1).sort((a, b) => {
            const distanceA = turf.distance(turf.point(a), turf.point(start));
            const distanceB = turf.distance(turf.point(b), turf.point(start));
            return distanceA - distanceB;
        });

        waypoints.splice(1, waypoints.length - 2, ...sortedWaypoints);  // Remplacez les waypoints existants par ceux triés
    }
}



    map.on('load', async () => {
        await getRoute();
        map.on('click', async (event) => {
            await addWaypoints(event);
            await getRoute();
        });
    });
})
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 92vh;
  position: absolute;
}
</style>
