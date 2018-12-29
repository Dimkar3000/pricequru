import actions from './actions';
import getters from './getters';
import { mutations } from './mutations';

const defaultState = {
  token: null
};

const user = {
  state: defaultState,
  actions,
  mutations,
  getters
};

export default user;
