import { request } from './agent';

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

const authenticationService = { login, logout, register };

export default authenticationService;

