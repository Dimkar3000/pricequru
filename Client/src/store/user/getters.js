const getters = {
  isAuthenticated: (state) => {
    return !!state.token;
  }
};

export default getters;
