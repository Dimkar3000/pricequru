import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

const user = {
  state: {
    token: null
  },
  actions,
  mutations,
  getters
};

export default user;
