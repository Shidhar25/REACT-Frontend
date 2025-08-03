// components/AllStationsMap.jsx
import React from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
};

const AllStationsMap = ({ stations }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = stations.length
    ? { lat: stations[0].latitude, lng: stations[0].longitude }
    : { lat: 19.076, lng: 72.8777 }; // Default to Mumbai

  if (!isLoaded) return <p className="text-sm text-blue-600">Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {stations.map((station) => (
        <MarkerF
          key={station.id}
          position={{ lat: station.latitude, lng: station.longitude }}
          icon={{
            url: '/assets/PoliceStation.png', // ✅ must be in public/assets
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          label={{
            text: station.stationName,
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#0f172a',
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default React.memo(AllStationsMap);
