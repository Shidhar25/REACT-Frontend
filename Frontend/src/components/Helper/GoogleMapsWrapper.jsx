import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  overflow: 'hidden'
};

const centerFromCoords = (lat, lng) => ({
  lat: parseFloat(lat),
  lng: parseFloat(lng)
});

export default function GoogleMapsWrapper({ lat, lng }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <div>Map Load Error</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  const center = centerFromCoords(lat, lng);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
      <Marker
        position={center}
        icon={{
          url: '/ambulance-icon.png', // Correct path for public folder
          scaledSize: isLoaded && window.google
            ? new window.google.maps.Size(50, 50)
            : undefined,
        }}
      />
    </GoogleMap>
  );
}