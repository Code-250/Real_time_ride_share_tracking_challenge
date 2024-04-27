"use client"

import { ControlPosition } from '@vis.gl/react-google-maps';
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';

interface Coordinate {
  name: string;
  lat: number;
  lng: number;
}

interface BusMapProps {
  waypoints: Coordinate[];
  busSpeed: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center: Coordinate = {
  name: "starting Point",
  lat: 0,
  lng: 0,
};

const Indicator: React.FC<BusMapProps> = ({ waypoints, busSpeed }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [busPosition, setBusPosition] = useState<Coordinate | null>(null);
  const [userZoomLevel, setUserZoomLevel] = useState(10);
  const [mapCenter, setMapCenter] = useState(center);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState<boolean>(false);

  const handleRecenter = () => {
    setMapCenter(center);
    setUserZoomLevel(12);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % waypoints.length);
      setPaused(false); // Resume movement after reaching each stop
    }, 20000); // Pause for 20 seconds at each stop

    return () => clearInterval(interval);
  }, [waypoints]);

  // useEffect(() => {
  //   if (!paused) {
  //     const startPoint = waypoints[currentIndex];
  //     const endPoint = waypoints[(currentIndex + 1) % waypoints.length];
  //     if (window.google?.maps && busPosition) {
  //       const distance = google.maps.geometry.spherical.computeDistanceBetween(
  //         new google.maps.LatLng(startPoint.lat, startPoint.lng),
  //         new google.maps.LatLng(endPoint.lat, endPoint.lng)
  //       );

  //       const time = distance / busSpeed; // Time in milliseconds

  //       const startTime = new Date().getTime();

  //       const updateBusPosition = () => {
  //         const currentTime = new Date().getTime();
  //         const elapsedTime = currentTime - startTime;
  //         const fractionOfJourneyCompleted = elapsedTime / time;

  //         if (fractionOfJourneyCompleted >= 1) {
  //           // Journey to next waypoint completed, move to next waypoint
  //           setCurrentIndex((prevIndex) => (prevIndex + 1) % waypoints.length);
  //           setPaused(true); // Pause movement after reaching each stop
  //         } else {
  //           const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * fractionOfJourneyCompleted;
  //           const lng = startPoint.lng + (endPoint.lng - startPoint.lng) * fractionOfJourneyCompleted;
  //           setBusPosition({ name: 'Bus', lat, lng });
  //         }
  //       };

  //       const intervalId = setInterval(updateBusPosition, 100); // Update position every 100 milliseconds

  //       return () => clearInterval(intervalId);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < waypoints.length) {
      const waypoint = waypoints[currentIndex];
      setMapCenter(waypoint);
      setUserZoomLevel(15)
    }
  }, [currentIndex, waypoints]);

  useEffect(() => {
    if (window.google?.maps && busPosition && waypoints.length > 1) {
      const directionsService = new window.google.maps.DirectionsService();
      const origin = new window.google.maps.LatLng(busPosition.lat, busPosition.lng);
      const destination = new window.google.maps.LatLng(waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lng);

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(response);
            setError(null);
          } else {
            setDirections(null);
            setError(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [busPosition, waypoints]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={{ zoomControl: false }}
        zoom={userZoomLevel}
        center={mapCenter}
        onZoomChanged={() => { /* Keep this empty to prevent changing zoom level outside re-center */ }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {busPosition && <Marker position={{ lat: busPosition.lat, lng: busPosition.lng }} label={busPosition.name} />}
        {waypoints.map((waypoint, index) => (
          <Marker key={index} position={{ lat: waypoint.lat, lng: waypoint.lng }} label={waypoint.name} />
        ))}
        <CustomControl position={ControlPosition.TOP_LEFT}>
          <button onClick={handleRecenter}>Re-center</button>
        </CustomControl>
      </GoogleMap>
    </LoadScript>
  );
};

interface CustomControlProps {
  position: ControlPosition;
  children: React.ReactNode;
}

const CustomControl: React.FC<CustomControlProps> = ({ position, children }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: 5, zIndex: 1 }}>
      {children}
    </div>
  );
};

export default Indicator;
