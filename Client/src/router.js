import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Product from './views/Product.vue';
import Products from './views/Products.vue';
import Search from './views/Search.vue';
import Shop from './views/Shop.vue';
import Shops from './views/Shops.vue';

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
      component: Products
    },
    {
      path: '/products/:id',
      name: 'product',
      component: Product,
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      props: (route) => {
        return {
          query: route.query.q
        };
      }
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
    }
  ]
});
