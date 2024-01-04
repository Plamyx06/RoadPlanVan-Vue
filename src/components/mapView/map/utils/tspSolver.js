import * as turf from '@turf/turf'

export function insertToMinimizeDistance(newWaypoint, waypoints) {
  let minimalAddedDistance = Infinity
  let optimalInsertPosition = 1

  for (let i = 0; i < waypoints.length - 1; i++) {
    const distanceBeforeInsert = turf.distance(
      turf.point([waypoints[i].lon, waypoints[i].lat]),
      turf.point([waypoints[i + 1].lon, waypoints[i + 1].lat])
    )
    const distanceAfterInsert =
      turf.distance(
        turf.point([waypoints[i].lon, waypoints[i].lat]),
        turf.point([newWaypoint.lon, newWaypoint.lat])
      ) +
      turf.distance(
        turf.point([newWaypoint.lon, newWaypoint.lat]),
        turf.point([waypoints[i + 1].lon, waypoints[i + 1].lat])
      )

    const addedDistance = distanceAfterInsert - distanceBeforeInsert

    if (addedDistance < minimalAddedDistance) {
      minimalAddedDistance = addedDistance
      optimalInsertPosition = i + 1
    }
  }

  waypoints.splice(optimalInsertPosition, 0, newWaypoint)
}
export function sortWaypointsByNearestNeighbor(waypoints) {
  const orderedWaypoints = [waypoints[0]]
  const remainingWaypoints = waypoints.slice(1)

  const sortRecursively = (lastPoint, remaining) => {
    if (remaining.length === 0) {
      return
    }

    let nearestPointIndex = 0
    let shortestDistance = turf.distance(
      turf.point([lastPoint.lon, lastPoint.lat]),
      turf.point([remaining[0].lon, remaining[0].lat])
    )

    for (let i = 1; i < remaining.length; i++) {
      const currentDistance = turf.distance(
        turf.point([lastPoint.lon, lastPoint.lat]),
        turf.point([remaining[i].lon, remaining[i].lat])
      )
      if (currentDistance < shortestDistance) {
        nearestPointIndex = i
        shortestDistance = currentDistance
      }
    }

    orderedWaypoints.push(remaining.splice(nearestPointIndex, 1)[0])
    sortRecursively(orderedWaypoints[orderedWaypoints.length - 1], remaining)
  }

  sortRecursively(orderedWaypoints[0], remainingWaypoints)

  waypoints.length = 0
  waypoints.push(...orderedWaypoints)
}
