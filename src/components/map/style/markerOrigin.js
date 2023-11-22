export function getGeojsonMarkerOrigin(waypoints) {
  return {
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
}

export function getMarkerCircleStyleOrigin(geojsonMarkerOrigin) {
  return {
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
}

export function getMarkerTextStyleOrigin(geojsonMarkerOrigin) {
  return {
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
}
