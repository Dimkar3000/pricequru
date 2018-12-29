import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import * as VueGoogleMaps from 'vue2-google-maps';

import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuetify); // Ensure you are using css-loader

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
