import axios from 'axios';

export async function getAddressFromCoords(lat, lng) {
  try {
    const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.REACT_APP_GOOGLE_API_KEY,
      },
    });

    const result = res.data?.results?.[0];
    return result ? result.formatted_address : 'Address not found';
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return 'Unable to fetch address';
  }
}

