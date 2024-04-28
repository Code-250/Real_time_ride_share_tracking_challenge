import {
	useEffect,
	useState,
} from "react"
type distanceCalculation = (
	directions: any,
	elapsedTime: number,
	busSpeed: number,
) => any

export const useDistanceCalculation: distanceCalculation =
	(
		directions,
		elapsedTime,
		busSpeed,
	) => {
		const [
			busLocation,
			setBusLocation,
		] = useState({
			name: "",
			lat: 0,
			lng: 0,
		})

		useEffect(() => {
			if (
				!directions ||
				!directions.routes ||
				!directions.routes[0]
			)
				return

			const route = directions.routes[0]
			const path = route.overview_path

			// Calculate total distance of the route
			const totalDistance =
				google.maps.geometry &&
				google.maps.geometry.spherical.computeLength(
					path,
				)

			// Calculate elapsed distance from the start
			const elapsedDistance =
				(elapsedTime * busSpeed) %
				totalDistance

			// Find the segment of the route based on elapsed distance
			let accumulatedDistance = 0
			let segmentIndex = 0
			for (
				let i = 1;
				i < path.length;
				i++
			) {
				const segmentStart = path[i - 1]
				const segmentEnd = path[i]
				const segmentDistance =
					google.maps.geometry.spherical.computeDistanceBetween(
						segmentStart,
						segmentEnd,
					)

				if (
					accumulatedDistance +
						segmentDistance >=
					elapsedDistance
				) {
					segmentIndex = i - 1
					break
				}
				accumulatedDistance +=
					segmentDistance
			}

			// Calculate ratio of progress within the current segment
			const segmentStart =
				path[segmentIndex]
			const segmentEnd =
				path[segmentIndex + 1]
			const segmentDistance =
				google.maps.geometry.spherical.computeDistanceBetween(
					segmentStart,
					segmentEnd,
				)
			const ratio =
				(elapsedDistance -
					accumulatedDistance) /
				segmentDistance

			// Interpolate bus position within the current segment
			const lat =
				segmentStart.lat() +
				(segmentEnd.lat() -
					segmentStart.lat()) *
					ratio
			const lng =
				segmentStart.lng() +
				(segmentEnd.lng() -
					segmentStart.lng()) *
					ratio

			setBusLocation({
				name: "",
				lat,
				lng,
			})
		}, [
			elapsedTime,
			directions,
			busSpeed,
		])

		return busLocation
	}
