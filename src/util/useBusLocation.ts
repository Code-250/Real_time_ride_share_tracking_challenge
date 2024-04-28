/* eslint-disable react-hooks/exhaustive-deps */
import {
	useState,
	useEffect,
} from "react"

interface BusLocation {
	name: string
	lat: number
	lng: number
}

interface Waypoint {
	lat: number
	lng: number
	name?: string
}

interface BusLocationHookReturn {
	distanceToNextStop: number
	timeToNextStop: number
	nextStopInfo: Waypoint | null
}

const useBusLocation = (
	busLocation: BusLocation,
	waypoints: Waypoint[],
	busSpeed: number,
): BusLocationHookReturn => {
	const [
		currentStopIndex,
		setCurrentStopIndex,
	] = useState(0)
	const [
		distanceToNextStop,
		setDistanceToNextStop,
	] = useState(0)
	const [
		timeToNextStop,
		setTimeToNextStop,
	] = useState(0)
	const [
		nextStopInfo,
		setNextStopInfo,
	] = useState<Waypoint | null>(null)

	// Haversine formula to calculate distance between two points
	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number => {
		const R = 6371 // Radius of the earth in km
		const dLat = deg2rad(lat2 - lat1)
		const dLon = deg2rad(lon2 - lon1)
		const a =
			Math.sin(dLat / 2) *
				Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) *
				Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2)
		const c =
			2 *
			Math.atan2(
				Math.sqrt(a),
				Math.sqrt(1 - a),
			)
		const d = R * c // Distance in km
		return d
	}

	const deg2rad = (
		deg: number,
	): number => {
		return deg * (Math.PI / 180)
	}

	useEffect(() => {
		if (
			busLocation &&
			waypoints.length > 1 &&
			currentStopIndex <
				waypoints.length - 1
		) {
			const nextStop =
				waypoints[currentStopIndex + 1]
			const distance =
				calculateDistance(
					busLocation.lat,
					busLocation.lng,
					nextStop.lat,
					nextStop.lng,
				)
			setDistanceToNextStop(distance)
			setTimeToNextStop(
				distance / busSpeed,
			)

			if (distance < 0.01) {
				// Adjust this threshold as needed
				setCurrentStopIndex(
					currentStopIndex + 1,
				)
			}

			setNextStopInfo(nextStop)
		}
	}, [
		busLocation,
		waypoints,
		busSpeed,
		currentStopIndex,
		calculateDistance,
	])

	return {
		distanceToNextStop,
		timeToNextStop,
		nextStopInfo,
	}
}

export default useBusLocation
