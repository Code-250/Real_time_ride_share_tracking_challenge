interface LatLngLiteral {
  lat: number;
  lng: number;
}

// Define a type for the response containing distance and duration
interface RouteInfo {
  distance: number | undefined; // Distance in kilometers
  duration: number | undefined; // Duration in minutes
}

// Define the function to calculate distance and duration
export async function calculateDistanceAndDuration(origin: LatLngLiteral, destination: LatLngLiteral): Promise<RouteInfo> {
  const directionsService = new google.maps.DirectionsService();
  const request = {
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING'
  };

  // Call the Directions API
  const response = await new Promise<google.maps.DirectionsResult | null>((resolve, reject) => {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK') {
        resolve(result);
      } else {
        reject(status);
      }
    });
  });
  const route = response?.routes[0].legs[0];
  const distance = route?.distance?.value !== undefined ? route?.distance?.value / 1000 : 0; // Distance in meters
  const duration = route?.duration?.value !== undefined ? route?.duration?.value / 60 : 0;
  return { distance, duration }
}

// // Example usage:
// const currentStop: LatLngLiteral = { lat: 12.345, lng: 67.890 }; // Current stop coordinates
// const nextStop: LatLngLiteral = { lat: 23.456, lng: 78.901 }; // Next stop coordinates

// calculateDistanceAndDuration(currentStop, nextStop)
//   .then(result => {
//     console.log('Distance:', result.distance, 'km');
//     console.log('Duration:', result.duration, 'minutes');
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
