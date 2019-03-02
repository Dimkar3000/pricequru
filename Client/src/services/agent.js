import axios from 'axios';

const agent = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
});

const request = ({
  method, url, data, params, token
}) => {
  const headers = {};
  if (token) {
    headers['X-OBSERVATORY-AUTH'] = token;
  }
  return agent.request({
    url,
    method,
    data,
    headers,
    params
  });
};

const setUnauthorizedHandler = (handler) => {
  agent.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      console.error(err);
      if (err && err.response && err.response.status === 401) {
        handler(err);
      }
      return Promise.reject(err);
    }
  );
};

export { request, setUnauthorizedHandler };
