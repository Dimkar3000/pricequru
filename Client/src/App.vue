<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Price Quru</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn flat>
        <span class="mr-2">Συνδεση</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import HomePage from './components/HomePage.vue';

export default {
  name: 'App',
  components: {
    HomePage
  },
  data() {
    return {
      //
    };
  }
};
</script>
