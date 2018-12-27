const types = {
  SET_TOKEN: 'SET_TOKEN'
};

const mutations = {
  [types.SET_TOKEN]: (state, payload) => {
    state.token = payload.token;
  }
};

export { mutations, types };
