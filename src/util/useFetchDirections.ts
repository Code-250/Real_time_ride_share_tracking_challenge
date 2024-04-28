import {
	useState,
	useEffect,
} from "react"

// const google = window.google

interface Waypoint {
	lat: number
	lng: number
	name?: string
}

interface FetchDirectionsHookReturn {
	directions: google.maps.DirectionsResult | null
	error: string | null
}

const useFetchDirections = (
	waypoints: Waypoint[],
): FetchDirectionsHookReturn => {
	const [directions, setDirections] =
		useState<google.maps.DirectionsResult | null>(
			null,
		)
	const [error, setError] = useState<
		string | null
	>(null)

	useEffect(() => {
		const fetchDirections = async (
			retries = 3,
		) => {
			try {
				const directionsService =
					new google.maps.DirectionsService()
				console.log(directionsService)
				if (directionsService) {
					let response =
						await new Promise<google.maps.DirectionsResult | null>(
							(resolve, reject) => {
								directionsService.route(
									{
										origin:
											waypoints[0],
										destination:
											waypoints[
												waypoints.length -
													1
											],
										travelMode:
											google.maps
												.TravelMode
												.DRIVING,
										waypoints: waypoints
											.slice(
												1,
												waypoints.length -
													1,
											)
											.map(
												(waypoint) => ({
													location:
														waypoint,
													stopover:
														true,
												}),
											),
									},
									(
										response,
										status,
									) => {
										if (
											status ===
											google.maps
												.DirectionsStatus
												.OK
										) {
											resolve(response)
										} else {
											reject(
												`Directions request failed: ${status}`,
											)
										}
									},
								)
							},
						)
				}

				let response =
					await new Promise<google.maps.DirectionsResult | null>(
						(resolve, reject) => {
							directionsService.route(
								{
									origin: waypoints[0],
									destination:
										waypoints[
											waypoints.length -
												1
										],
									travelMode:
										google.maps
											.TravelMode
											.DRIVING,
									waypoints: waypoints
										.slice(
											1,
											waypoints.length -
												1,
										)
										.map(
											(waypoint) => ({
												location:
													waypoint,
												stopover: true,
											}),
										),
								},
								(response, status) => {
									if (
										status ===
										google.maps
											.DirectionsStatus
											.OK
									) {
										resolve(response)
									} else {
										reject(
											`Directions request failed: ${status}`,
										)
									}
								},
							)
						},
					)

				if (response) {
					console.log(
						"got the directions....",
					)

					setDirections(response)
					setError(null)
				} else if (retries > 0) {
					// Retry the request if the response is null and retries are left
					console.log(
						"retrying for directions....",
					)

					await fetchDirections(
						retries - 1,
					)
				} else {
					setError(
						"Failed to get directions after multiple attempts. Please try again later.",
					)
				}
			} catch (error) {
				console.log(
					error,
					"this is the error",
				)

				setDirections(null)
				setError(
					"Failed to get directions. Please try again later.",
				)
			}
		}

		fetchDirections()
	}, [waypoints])

	return { directions, error }
}

export default useFetchDirections
