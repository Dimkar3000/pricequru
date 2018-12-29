import createAction from '../create-action';
import { types } from './mutations';

const logout = ({ commit }) => {
  commit(types.SET_TOKEN, {
    token: null
  });
  commit(types.SET_USER_DATA, {
    email: null
  });
};

const setToken = createAction(types.SET_TOKEN);
const setUserData = createAction(types.SET_USER_DATA);

const actions = {
  logout,
  setToken,
  setUserData
};

export default actions;
