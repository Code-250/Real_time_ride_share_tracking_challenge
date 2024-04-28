"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { calculateDistanceAndDuration } from '@/util/calculateDistanceAndDuration';

interface Coordinate {
  name: string;
  lat: number;
  lng: number;
}

interface BusMapProps {
  waypoints: Coordinate[];
  busSpeed: number; // Speed in meters per second
}

const mapContainerStyle = {
  width: '100%',
  height: '90vh',
};

const GoogleMapComponent: React.FC<BusMapProps> = ({ waypoints, busSpeed }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null | any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [busLocation, setBusLocation] = useState<Coordinate | null>(null);
  const [currentStop, setCurrentStop] = useState({ name: waypoints[0].name, lat: waypoints[0].lat, lng: waypoints[0].lng });
  const [nextStop, setNextStop] = useState({ name: waypoints[1].name, lat: waypoints[1].lat, lng: waypoints[1].lng });
  const [distanceToNextStop, setDistanceToNextStop] = useState(0);
  const [timeToNextStop, setTimeToNextStop] = useState(0);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  useEffect(() => {
    // Calculate distance and time to next stop
    calculateDistanceAndDuration(currentStop, nextStop)
      .then((routeInfo: any) => {
        console.log(routeInfo.distance, routeInfo.duration, "these are the distance and duration");
      })
      .catch(error => {
        console.error('Error calculating route:', error);
      });
  }, [currentStop, nextStop]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1); // Increment elapsed time every second
    }, 1000); // Update elapsed time every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const directionsService = new window.google.maps.DirectionsService();

        const response = await new Promise<google.maps.DirectionsResult | null>((resolve, reject) => {
          directionsService.route(
            {
              origin: waypoints[0],
              destination: waypoints[waypoints.length - 1],
              travelMode: window.google.maps.TravelMode.DRIVING,
              waypoints: waypoints.slice(1, waypoints.length - 1).map(waypoint => ({
                location: waypoint,
                stopover: true,
              })),
            },
            (response, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                resolve(response);
              } else {
                reject(`Directions request failed: ${status}`);
              }
            }
          );
        });

        setDirections(response);
        setError(null);
      } catch (error) {
        setDirections(null);
        setError("Failed to get directions. Please try again later.");
      }
    };

    fetchDirections();
  }, [waypoints]);

  useEffect(() => {
    if (!directions || !directions.routes || !directions.routes[0]) return;

    const route = directions.routes[0];
    const path = route.overview_path;

    // Calculate total distance of the route
    const totalDistance = google.maps.geometry && google.maps.geometry.spherical.computeLength(path);

    // Calculate elapsed distance from the start
    const elapsedDistance = (elapsedTime * busSpeed) % totalDistance;

    // Find the segment of the route based on elapsed distance
    let accumulatedDistance = 0;
    let segmentIndex = 0;
    for (let i = 1; i < path.length; i++) {
      const segmentStart = path[i - 1];
      const segmentEnd = path[i];
      const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);
      // console.log(segmentDistance);

      if (accumulatedDistance + segmentDistance >= elapsedDistance) {
        segmentIndex = i - 1;
        break;
      }
      accumulatedDistance += segmentDistance;
    }

    // Calculate ratio of progress within the current segment
    const segmentStart = path[segmentIndex];
    const segmentEnd = path[segmentIndex + 1];
    const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);
    const ratio = (elapsedDistance - accumulatedDistance) / segmentDistance;

    // Interpolate bus position within the current segment
    const lat = segmentStart.lat() + (segmentEnd.lat() - segmentStart.lat()) * ratio;
    const lng = segmentStart.lng() + (segmentEnd.lng() - segmentStart.lng()) * ratio;

    setBusLocation({ name: '', lat, lng });
  }, [elapsedTime, directions, busSpeed]);
  const [center, setCenter] = useState({ lat: -1.939826787816454, lng: 30.0445426438232 });
  const [zoom, setZoom] = useState(15);
  // console.log(busLocation);

  // Logic to handle reaching a stop
  useEffect(() => {
    if (!busLocation) return;

    const distancesToStops = waypoints.map(stop => ({
      stop,
      distance: google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(stop.lat, stop.lng),
        new google.maps.LatLng(busLocation.lat, busLocation.lng)
      )
    }));

    // Find the closest stop
    const closestStop = distancesToStops.reduce((closest, current) => (
      current.distance < closest.distance ? current : closest
    ));

    const { stop: closestStopData, distance: distanceToClosestStop } = closestStop;

    const nextStopIndex = currentStopIndex + 1;
    const nextStop = waypoints[nextStopIndex];

    if (nextStopIndex < waypoints.length) {
      const distanceToNextStop = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(nextStop.lat, nextStop.lng),
        new google.maps.LatLng(busLocation.lat, busLocation.lng)
      );

      const distanceBetweenStops = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(currentStop.lat, currentStop.lng),
        new google.maps.LatLng(nextStop.lat, nextStop.lng)
      );

      const distanceLeftToNextStop = distanceBetweenStops - distanceToClosestStop;

      if (distanceLeftToNextStop < 0) {
        console.log("The bus passed the next stop");
        setCurrentStopIndex(prevIndex => prevIndex + 1);
        setCurrentStop(nextStop);
        setNextStop(waypoints[nextStopIndex + 1]);
      } else {
        console.log(`Distance left to ${nextStop.name}: ${distanceLeftToNextStop.toFixed(2)} meters`);
      }
    } else {
      console.log("The bus reached the last stop");
    }
  }, [busLocation]);




  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""} >
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center}
        zoom={zoom}
        // onCenterChanged={() => setCenter(map.getCenter())}
        // onZoomChanged={() => setZoom(map.getZoom())}
        options={{ zoomControl: false, fullscreenControl: false }}>
        {directions && <DirectionsRenderer directions={directions} />}

        {error && <div>Error: {error}</div>}
        {busLocation && <Marker icon={{
          url: `https://cdn1.iconfinder.com/data/icons/map-navigation-elements/512/bus-station-object-map-pointer-512.png`, // Replace with the path to your marker image
          scaledSize: new window.google.maps.Size(40, 40), // Adjust the anchor point if needed
        }} position={{ lat: busLocation.lat, lng: busLocation.lng }} />}

        {/* {waypoints.map((waypoint, index) => (
          <Marker key={index} position={{ lat: waypoint.lat, lng: waypoint.lng }} label={waypoint.name} />
        ))} */}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
