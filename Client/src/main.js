import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueSweetalert2 from 'vue-sweetalert2';

import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import { setUnauthorizedHandler } from './services/agent';


Vue.config.productionTip = false;

Vue.use(Vuetify); // Ensure you are using css-loader

Vue.use(VueSweetalert2);
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY
  }
});


new Vue({
  router,
  store,
  render: (h) => {
    return h(App);
  }
}).$mount('#app');

setUnauthorizedHandler(() => {
  store.dispatch('logout');
  localStorage.clear();
});
