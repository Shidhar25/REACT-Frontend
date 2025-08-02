const addressCache = new Map();

export const getAddressFromCoords = async (lat, lng) => {
  const key = `${lat},${lng}`;
  if (addressCache.has(key)) return addressCache.get(key);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'OK') {
      const address = data.results[0]?.formatted_address || 'Unknown location';
      addressCache.set(key, address);
      return address;
    } else {
      console.error('Geocoding error:', data.status);
      return 'Location unavailable';
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
    return 'Location error';
  }
};
