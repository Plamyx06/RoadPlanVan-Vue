import { nextTick } from 'vue'
import cuid from 'cuid'

export function handleResize(map, isFullSize) {
  isFullSize.value = !isFullSize.value
  nextTick(() => {
    map.resize()
  })
}

export function createWaypoint(lon, lat, city, countryCode, country) {
  return {
    id: cuid(),
    lon,
    lat,
    city,
    countryCode,
    country
  }
}

export async function checkLastSearchValue(value) {
  console.log(value)
  if (value.length === 0) {
    return false
  } else {
    return true
  }
}

export function getPointsIdsFromMap(map) {
  const layers = map.getStyle().layers
  const pointDetails = []

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    if (layer.id.startsWith('point-label')) {
      const layerDetails = {
        id: layer
      }
      pointDetails.push(layerDetails)
    }
  }

  return pointDetails
}
