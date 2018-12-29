const login = (email, password) => {
  if (!email.trim() || !password.trim()) {
    return Promise.reject();
  }
  return Promise.resolve();
};

const logout = () => {
  return Promise.resolve();
};

const register = (email, password) => {
  if (!email.trim() || !password.trim()) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export default {
  login,
  logout,
  register
};
