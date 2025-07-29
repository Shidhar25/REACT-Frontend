import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

interface Coords {
  latitude: number;
  longitude: number;
}

interface LiveMapProps {
  patientCoords: Coords;
  ambulanceCoords?: Coords;
  fireTruckCoords?: Coords;
}

const homeSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#00bcd4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
`;

const ambulanceSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff9800" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="20" height="10" rx="2"/>
    <circle cx="7" cy="19" r="2"/>
    <circle cx="17" cy="19" r="2"/>
    <rect x="16" y="9" width="4" height="4" rx="1" fill="#fff"/>
    <rect x="4" y="9" width="6" height="4" rx="1" fill="#fff"/>
  </svg>
`;

const fireTruckSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#e53935" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="8" width="20" height="8" rx="2"/>
    <circle cx="7" cy="20" r="2"/>
    <circle cx="17" cy="20" r="2"/>
    <rect x="16" y="10" width="4" height="4" rx="1" fill="#fff"/>
    <rect x="4" y="10" width="6" height="4" rx="1" fill="#fff"/>
    <rect x="10" y="6" width="4" height="4" rx="1" fill="#e53935"/>
  </svg>
`;

export default function LiveMap({ patientCoords, ambulanceCoords, fireTruckCoords }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const ambulanceMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const fireTruckMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const ambulanceAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const fireTruckAnimationRef = useRef<NodeJS.Timeout | null>(null);
  
  const [ambulanceRoute, setAmbulanceRoute] = useState<[number, number][]>([]);
  const [fireTruckRoute, setFireTruckRoute] = useState<[number, number][]>([]);
  const [ambulanceCurrentIndex, setAmbulanceCurrentIndex] = useState(0);
  const [fireTruckCurrentIndex, setFireTruckCurrentIndex] = useState(0);
  const [ambulanceArrived, setAmbulanceArrived] = useState(false);
  const [fireTruckArrived, setFireTruckArrived] = useState(false);
  const [showAmbulanceDialog, setShowAmbulanceDialog] = useState(false);
  const [showFireTruckDialog, setShowFireTruckDialog] = useState(false);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [patientCoords.longitude, patientCoords.latitude],
      zoom: 13,
    });

    // Patient Home Marker (custom home icon)
    const homeEl = document.createElement('div');
    homeEl.innerHTML = homeSVG;
    homeEl.style.transform = 'translate(-50%, -100%)';
    new mapboxgl.Marker({ element: homeEl })
      .setLngLat([patientCoords.longitude, patientCoords.latitude])
      .setPopup(new mapboxgl.Popup().setText('Patient Home'))
      .addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [patientCoords.longitude, patientCoords.latitude]);

  // Fetch ambulance route when coordinates change
  useEffect(() => {
    if (!ambulanceCoords || !mapRef.current || ambulanceArrived) return;

    // Clear existing animation
    if (ambulanceAnimationRef.current) {
      clearInterval(ambulanceAnimationRef.current);
      ambulanceAnimationRef.current = null;
    }

    // Remove existing route layer
    if (mapRef.current.getLayer('ambulanceRoute')) {
      mapRef.current.removeLayer('ambulanceRoute');
    }
    if (mapRef.current.getSource('ambulanceRoute')) {
      mapRef.current.removeSource('ambulanceRoute');
    }

    // Remove existing marker
    if (ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current.remove();
    }

    // Fetch route
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${ambulanceCoords.longitude},${ambulanceCoords.latitude};${patientCoords.longitude},${patientCoords.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(res => res.json())
      .then(data => {
        const route = data.routes[0].geometry.coordinates;
        setAmbulanceRoute(route);
        setAmbulanceCurrentIndex(0);
        setAmbulanceArrived(false);

        // Add route layer
        mapRef.current!.addSource('ambulanceRoute', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          }
        });

        mapRef.current!.addLayer({
          id: 'ambulanceRoute',
          type: 'line',
          source: 'ambulanceRoute',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#080500', 'line-width': 3 }
        });

        // Create ambulance marker
        const ambulanceEl = document.createElement('div');
        ambulanceEl.innerHTML = ambulanceSVG;
        ambulanceEl.style.transform = 'translate(-50%, -100%)';
        ambulanceMarkerRef.current = new mapboxgl.Marker({ element: ambulanceEl })
          .setLngLat(route[0])
          .setPopup(new mapboxgl.Popup().setText('Ambulance'))
          .addTo(mapRef.current!);

        // Start animation
        startAmbulanceAnimation(route);
      });
  }, [ambulanceCoords, patientCoords.longitude, patientCoords.latitude, ambulanceArrived]);

  // Fetch fire truck route when coordinates change
  useEffect(() => {
    if (!fireTruckCoords || !mapRef.current || fireTruckArrived) return;

    // Clear existing animation
    if (fireTruckAnimationRef.current) {
      clearInterval(fireTruckAnimationRef.current);
      fireTruckAnimationRef.current = null;
    }

    // Remove existing route layer
    if (mapRef.current.getLayer('fireTruckRoute')) {
      mapRef.current.removeLayer('fireTruckRoute');
    }
    if (mapRef.current.getSource('fireTruckRoute')) {
      mapRef.current.removeSource('fireTruckRoute');
    }

    // Remove existing marker
    if (fireTruckMarkerRef.current) {
      fireTruckMarkerRef.current.remove();
    }

    // Fetch route
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${fireTruckCoords.longitude},${fireTruckCoords.latitude};${patientCoords.longitude},${patientCoords.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(res => res.json())
      .then(data => {
        const route = data.routes[0].geometry.coordinates;
        setFireTruckRoute(route);
        setFireTruckCurrentIndex(0);
        setFireTruckArrived(false);

        // Add route layer
        mapRef.current!.addSource('fireTruckRoute', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          }
        });

        mapRef.current!.addLayer({
          id: 'fireTruckRoute',
          type: 'line',
          source: 'fireTruckRoute',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#e53935',
            'line-width': 3,
            'line-dasharray': [2, 4]
          }
        });

        // Create fire truck marker
        const fireTruckEl = document.createElement('div');
        fireTruckEl.innerHTML = fireTruckSVG;
        fireTruckEl.style.transform = 'translate(-50%, -100%)';
        fireTruckMarkerRef.current = new mapboxgl.Marker({ element: fireTruckEl })
          .setLngLat(route[0])
          .setPopup(new mapboxgl.Popup().setText('Fire Truck'))
          .addTo(mapRef.current!);

        // Start animation
        startFireTruckAnimation(route);
      });
  }, [fireTruckCoords, patientCoords.longitude, patientCoords.latitude, fireTruckArrived]);

  const startAmbulanceAnimation = (route: [number, number][]) => {
    ambulanceAnimationRef.current = setInterval(() => {
      setAmbulanceCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (nextIndex >= route.length) {
          // Arrived at destination
          clearInterval(ambulanceAnimationRef.current!);
          ambulanceAnimationRef.current = null;
          setAmbulanceArrived(true);
          setShowAmbulanceDialog(true);
          return prevIndex;
        }

        // Update marker position
        if (ambulanceMarkerRef.current) {
          ambulanceMarkerRef.current.setLngLat(route[nextIndex]);
        }

        return nextIndex;
      });
    }, 1000); // 1 second interval
  };

  const startFireTruckAnimation = (route: [number, number][]) => {
    fireTruckAnimationRef.current = setInterval(() => {
      setFireTruckCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (nextIndex >= route.length) {
          // Arrived at destination
          clearInterval(fireTruckAnimationRef.current!);
          fireTruckAnimationRef.current = null;
          setFireTruckArrived(true);
          setShowFireTruckDialog(true);
          return prevIndex;
        }

        // Update marker position
        if (fireTruckMarkerRef.current) {
          fireTruckMarkerRef.current.setLngLat(route[nextIndex]);
        }

        return nextIndex;
      });
    }, 1000); // 1 second interval
  };

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (ambulanceAnimationRef.current) {
        clearInterval(ambulanceAnimationRef.current);
      }
      if (fireTruckAnimationRef.current) {
        clearInterval(fireTruckAnimationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-xl shadow" />
      
      {/* Ambulance Arrival Dialog */}
      {showAmbulanceDialog && (
        <div className="absolute top-4 left-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🚑 Ambulance Arrived!</span>
            <button 
              onClick={() => setShowAmbulanceDialog(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Fire Truck Arrival Dialog */}
      {showFireTruckDialog && (
        <div className="absolute top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🚒 Fire Truck Arrived!</span>
            <button 
              onClick={() => setShowFireTruckDialog(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 