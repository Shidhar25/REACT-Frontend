import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function NavigationMap() {
  const { requestId, vehicleType } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showAllVehicles, setShowAllVehicles] = useState(false);

  useEffect(() => {
    fetchLocationData();
  }, [requestId]);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get JWT token
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      if (showAllVehicles) {
        // Fetch both ambulance and fire truck data
        const [ambulanceResponse, fireTruckResponse] = await Promise.all([
          fetch(`http://localhost:8080/location-map/ambulance/${requestId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:8080/location-map/fire_truck/${requestId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const ambulanceData = ambulanceResponse.ok ? await ambulanceResponse.json() : null;
        const fireTruckData = fireTruckResponse.ok ? await fireTruckResponse.json() : null;

        const combinedData = {
          emergencyRequest: ambulanceData?.emergencyRequest || fireTruckData?.emergencyRequest,
          ambulance: ambulanceData?.ambulance,
          fireTruck: fireTruckData?.fireTruck
        };

        console.log('Combined location data:', combinedData);
        setLocationData(combinedData);
        initializeMap(combinedData);
      } else {
        // Single vehicle fetch
        const endpoint = vehicleType 
          ? `http://localhost:8080/location-map/${vehicleType}/${requestId}`
          : `http://localhost:8080/location-map/${requestId}`;
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || 'Failed to fetch location data.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Received location data:', data);
        setLocationData(data);
        initializeMap(data);
      }
    } catch (err) {
      console.error('API Error:', err);
      
      // Fallback to mock data for testing
      console.log('Using mock data for testing...');
      const mockData = getMockData();
      setLocationData(mockData);
      initializeMap(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    if (showAllVehicles) {
      // Mock data for both vehicles
      return {
        emergencyRequest: {
          id: parseInt(requestId),
          latitude: 18.5104,
          longitude: 73.8467
        },
        ambulance: {
          id: parseInt(requestId),
          latitude: 18.6104,
          longitude: 73.8467
        },
        fireTruck: {
          id: parseInt(requestId),
          latitude: 18.506,
          longitude: 73.809
        }
      };
    } else {
      // Mock data based on vehicle type and request ID
      if (vehicleType === 'fire_truck') {
        return {
          emergencyRequest: {
            id: parseInt(requestId),
            latitude: 18.520492,
            longitude: 73.853767
          },
          fireTruck: {
            id: parseInt(requestId),
            latitude: 18.506,
            longitude: 73.809
          }
        };
      } else {
        return {
          emergencyRequest: {
            id: parseInt(requestId),
            latitude: 18.5104,
            longitude: 73.8467
          },
          ambulance: {
            id: parseInt(requestId),
            latitude: 18.6104,
            longitude: 73.8467
          }
        };
      }
    }
  };

  const initializeMap = (data) => {
    // Load Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);
      
      // Initialize map after CSS is loaded
      setTimeout(() => {
        createMap(data);
      }, 100);
    };
    document.head.appendChild(script);
  };

  const createMap = (data) => {
    // Validate data structure
    if (!data || !data.emergencyRequest || !data.emergencyRequest.longitude || !data.emergencyRequest.latitude) {
      setError('Invalid emergency request data received.');
      return;
    }

    const vehicleData = data.ambulance || data.fireTruck;
    if (!vehicleData || !vehicleData.longitude || !vehicleData.latitude) {
      setError('Invalid vehicle data received.');
      return;
    }

    // You'll need to replace 'YOUR_MAPBOX_ACCESS_TOKEN' with actual token
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';
    
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [
        (data.emergencyRequest.longitude + vehicleData.longitude) / 2,
        (data.emergencyRequest.latitude + vehicleData.latitude) / 2
      ],
      zoom: 12
    });

    mapInstance.on('load', () => {
      // Add emergency request marker
      new mapboxgl.Marker({ color: '#FF4444' })
        .setLngLat([data.emergencyRequest.longitude, data.emergencyRequest.latitude])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Emergency Request</h3>'))
        .addTo(mapInstance);

      // Add ambulance marker if available
      if (data.ambulance) {
        new mapboxgl.Marker({ color: '#44FF44' })
          .setLngLat([data.ambulance.longitude, data.ambulance.latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Ambulance</h3>'))
          .addTo(mapInstance);
      }

      // Add fire truck marker if available
      if (data.fireTruck) {
        new mapboxgl.Marker({ color: '#FF8800' })
          .setLngLat([data.fireTruck.longitude, data.fireTruck.latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Fire Truck</h3>'))
          .addTo(mapInstance);
      }

      // Get directions for all available vehicles
      getDirections(data, mapInstance);
    });

    setMap(mapInstance);
  };

  const getDirections = async (data, mapInstance) => {
    try {
      const routes = [];
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add emergency request to bounds
      bounds.extend([data.emergencyRequest.longitude, data.emergencyRequest.latitude]);

      // Get directions for ambulance if available
      if (data.ambulance) {
        bounds.extend([data.ambulance.longitude, data.ambulance.latitude]);
        const ambulanceRoute = await getRouteDirections(data.ambulance, data.emergencyRequest, 'ambulance');
        if (ambulanceRoute) {
          routes.push(ambulanceRoute);
          addRouteToMap(mapInstance, ambulanceRoute, 'ambulance-route', '#44FF44');
        }
      }

      // Get directions for fire truck if available
      if (data.fireTruck) {
        bounds.extend([data.fireTruck.longitude, data.fireTruck.latitude]);
        const fireTruckRoute = await getRouteDirections(data.fireTruck, data.emergencyRequest, 'fire-truck');
        if (fireTruckRoute) {
          routes.push(fireTruckRoute);
          addRouteToMap(mapInstance, fireTruckRoute, 'fire-truck-route', '#FF8800');
        }
      }

      // Calculate combined route info
      if (routes.length > 0) {
        const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
        const avgTime = routes.reduce((sum, route) => sum + route.duration, 0) / routes.length;
        
        setRouteInfo({
          distance: (totalDistance / 1000).toFixed(1),
          duration: Math.round(avgTime / 60),
          vehicleCount: routes.length
        });
      }

      // Fit map to show all markers and routes
      mapInstance.fitBounds(bounds, { padding: 50 });
    } catch (err) {
      console.error('Error getting directions:', err);
    }
  };

  const getRouteDirections = async (vehicle, emergency, vehicleType) => {
    try {
      const start = `${vehicle.longitude},${vehicle.latitude}`;
      const end = `${emergency.longitude},${emergency.latitude}`;
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const route = await response.json();
      
      if (route.routes && route.routes.length > 0) {
        return {
          ...route.routes[0],
          vehicleType
        };
      }
    } catch (err) {
      console.error(`Error getting ${vehicleType} directions:`, err);
    }
    return null;
  };

  const addRouteToMap = (mapInstance, routeData, sourceId, color) => {
    mapInstance.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: routeData.geometry
      }
    });

    mapInstance.addLayer({
      id: sourceId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': 3,
        'line-opacity': 0.8
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading navigation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchLocationData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Navigation</h1>
              <p className="text-gray-600">Emergency Request #{requestId}</p>
            </div>
            <div className="text-right">
              {routeInfo ? (
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-green-600">Distance: {routeInfo.distance} km</div>
                  <div className="font-semibold text-blue-600">ETA: {routeInfo.duration} min</div>
                  <div className="text-xs text-gray-500">
                    {routeInfo.vehicleCount > 1 ? `${routeInfo.vehicleCount} Vehicles` : 
                     (locationData?.ambulance ? 'Ambulance' : 'Fire Truck')} Navigation
                  </div>
                </div>
              ) : locationData && (
                <div className="text-sm text-gray-600">
                  <div>Distance: Calculating...</div>
                  <div>ETA: Calculating...</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Toggle Button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => {
                setShowAllVehicles(!showAllVehicles);
                setRouteInfo(null);
                setTimeout(() => fetchLocationData(), 100);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition"
            >
              {showAllVehicles ? 'Show Single Vehicle' : 'Show All Vehicles'}
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div id="map" className="w-full h-screen"></div>
        
        {/* Info Panel */}
        {locationData && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Location Details</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Emergency Request</h4>
                <div className="text-xs text-gray-600">
                  <div>ID: {locationData.emergencyRequest.id}</div>
                  <div>Lat: {locationData.emergencyRequest.latitude.toFixed(6)}</div>
                  <div>Lng: {locationData.emergencyRequest.longitude.toFixed(6)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  {locationData.ambulance ? 'Ambulance' : 'Fire Truck'}
                </h4>
                <div className="text-xs text-gray-600">
                  <div>ID: {(locationData.ambulance || locationData.fireTruck).id}</div>
                  <div>Lat: {(locationData.ambulance || locationData.fireTruck).latitude.toFixed(6)}</div>
                  <div>Lng: {(locationData.ambulance || locationData.fireTruck).longitude.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 