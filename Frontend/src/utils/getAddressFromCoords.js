import axios from 'axios';

// Simple in-memory cache (outside function)
const geocodeCache = new Map();
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const getAddressFromCoords = async (lat, lng) => {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.status === "OK") {
      return data.results[0]?.formatted_address || "Address not found";
    } else {
      throw new Error(data.error_message || "Failed to fetch address");
    }
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
};
