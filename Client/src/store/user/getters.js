const getters = {
  isAuthenticated: (state) => {
    return !!state.token;
  }
};

export { getters };
