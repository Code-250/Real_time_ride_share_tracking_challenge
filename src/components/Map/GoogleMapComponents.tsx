"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';
import useBusLocation from '../../util/useBusLocation'; // Import the custom hook
import useFetchDirections from '../../util/useFetchDirections'; // Import the custom hook
import { useDistanceCalculation } from '../../util/useDistanceCalculation';

interface Coordinate {
  name: string;
  lat: number;
  lng: number;
}

interface Waypoint {
  lat: number;
  lng: number;
  name?: string;
}

interface GoogleMapComponentProps {
  waypoints: Waypoint[];
  busSpeed: number;
  directions: any;
  busLocation: any;
  error: string;
}
const mapContainerStyle = {
  width: '100%',
  height: '90vh',
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ waypoints, directions, busLocation, error }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
    libraries: ['places'],
  });

  const [center, setCenter] = useState({ lat: -1.939826787816454, lng: 30.0445426438232 });
  const [zoom, setZoom] = useState(15);

  return (isLoaded &&
    // <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""} >
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={zoom} options={{ zoomControl: false, fullscreenControl: false }}>
      {directions && <DirectionsRenderer directions={directions} />}
      {error && <div>Error: {error}</div>}
      {busLocation && <Marker icon={{ url: `https://cdn1.iconfinder.com/data/icons/map-navigation-elements/512/bus-station-object-map-pointer-512.png`, scaledSize: new google.maps.Size(40, 40) }} position={{ lat: busLocation.lat, lng: busLocation.lng }} />}
      {waypoints.map((waypoint, index) => (
        <Marker key={index} position={{ lat: waypoint.lat, lng: waypoint.lng }} label={waypoint.name} />
      ))}
    </GoogleMap>
    // </LoadScript>
  );
};

export default GoogleMapComponent;
