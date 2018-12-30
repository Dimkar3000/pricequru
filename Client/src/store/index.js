import Vue from 'vue';
import Vuex from 'vuex';

import products from './products';
import shops from './shops';
import user from './user';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    products,
    shops,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
});
