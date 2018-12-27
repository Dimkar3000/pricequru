import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuetify); // Ensure you are using css-loader

new Vue({
  router,
  store,
  render: (h) => {
    return h(App);
  }
}).$mount('#app');
