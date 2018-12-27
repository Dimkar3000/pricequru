const createAction = (type) => {
  return ({ commit }, payload) => {
    commit(type, payload);
  };
};

export default createAction;
