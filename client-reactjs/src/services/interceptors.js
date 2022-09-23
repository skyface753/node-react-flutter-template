import axios from 'axios';
// import Router from 'next/router';
import config from '../config.json';
const API_URL = config.BackendUrl;
const onRequest = (config) => {
  const token = JSON.parse(localStorage.getItem('csrfToken'));
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }

  return config;
};

const onRequestError = (error) => {
  console.log('onRequestError', error);
  return Promise.reject(error);
};

const onResponse = (response) => {
  console.log('onResponse', response);
  return response;
};

const onResponseError = async (error) => {
  console.log('onResponseError', error);
  if (error.response) {
    // Access Token was expired
    if (
      error.response.status === 401 &&
      error.response.data.error === 'jwt expired'
    ) {
      const oldRefreshToken = JSON.parse(localStorage.getItem('refreshToken'));
      console.log('oldRefreshToken', oldRefreshToken);
      try {
        const rs = await axios.post(`${API_URL}/auth/refreshToken`, {
          refreshToken: oldRefreshToken,
        });

        const { refreshToken, accessToken, csrfToken, user } = rs.data.data;

        localStorage.setItem('accessToken', JSON.stringify(accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
        localStorage.setItem('csrfToken', JSON.stringify(csrfToken));
        console.log('newRefreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return axios(error.config);
      } catch (_error) {
        console.log('onResponseError2', _error);
        return Promise.reject(_error);
      }
    }
  }
  console.log('OnResponseError END  ');
  return Promise.reject(error);
};

export const setupInterceptorsTo = (axiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};
