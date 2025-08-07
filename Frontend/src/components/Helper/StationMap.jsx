// components/StationMap.jsx
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
  marginBottom: '1.5rem'
};

const defaultCenter = {
  lat: 20.5937, // India center
  lng: 78.9629
};

export default function StationMap({ stations }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY' // ⛔️ Replace with your real key, domain-restricted
  });

  const center = stations.length > 0
    ? { lat: stations[0].latitude, lng: stations[0].longitude }
    : defaultCenter;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
    >
      {stations.map(station => (
        <Marker
          key={station.id}
          position={{ lat: station.latitude, lng: station.longitude }}
          title={station.stationName}
        />
      ))}
    </GoogleMap>
  ) : (
    <div className="text-gray-500 text-sm">Loading map...</div>
  );
}
