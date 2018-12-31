import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Product from './views/Product.vue';
import Products from './views/Products.vue';
import Shop from './views/Shop.vue';
import Shops from './views/Shops.vue';

import LocationSelector from './components/LocationSelector.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/products',
      name: 'products',
      component: Products,
      props: (route) => {
        return {
          query: route.query.q
        };
      }
    },
    {
      path: '/products/:id',
      name: 'product',
      component: Product,
      props: true
    },
    {
      path: '/shops',
      name: 'shops',
      component: Shops
    },
    {
      path: '/shops/:id',
      name: 'shop',
      component: Shop,
      props: true
    },
    {
      path: '/test',
      component: LocationSelector
    }
  ]
});
