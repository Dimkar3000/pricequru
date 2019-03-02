const types = {
  SET_TOKEN: 'SET_TOKEN',
  SET_USER_DATA: 'SET_USER_DATA'
};

const mutations = {
  [types.SET_TOKEN]: (state, payload) => {
    state.token = payload.token;
  },
  [types.SET_USER_DATA]: (state, payload) => {
    state.isAdmin = payload.isAdmin;
  }
};

export { mutations, types };
