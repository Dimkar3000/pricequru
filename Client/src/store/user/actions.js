import createAction from '../create-action';
import { types } from './mutations';

const actions = {
  setToken: createAction(types.SET_TOKEN)
};

export default actions;
