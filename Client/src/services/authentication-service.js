import { request } from './agent';

function getData(token) {
  return request({
    method: 'GET',
    url: 'getUserData',
    token
  });
}
function login(password, username) {
  const data = {
    password,
    username
  };
  return request({
    method: 'POST',
    url: 'login',
    data
  });
}

function logout(token) {
  return request({
    method: 'POST',
    url: 'logout',
    token
  });
}

function register(password, username) {
  const data = {
    password,
    username
  };
  return request({
    method: 'POST',
    url: 'register',
    data
  });
}

const authenticationService = {
  getData, login, logout, register
};

export default authenticationService;

