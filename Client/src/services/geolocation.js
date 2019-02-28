function getCurrentLocation() {
  if (!('geolocation' in navigator)) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

const geolocation = { getCurrentLocation };

export default geolocation;

