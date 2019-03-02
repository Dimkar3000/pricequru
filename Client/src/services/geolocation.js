import axios from 'axios';

function getCurrentLocation() {
  if (!('geolocation' in navigator)) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function geocodeAddress(address) {
  return axios.get(`https://maps.google.com/maps/api/geocode/json?address=${address}&key=${process.env.VUE_APP_GOOGLE_API_KEY}`);
}

const geolocation = { getCurrentLocation, geocodeAddress };

export default geolocation;

