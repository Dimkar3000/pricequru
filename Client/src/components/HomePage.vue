<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-flex>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Καλώς ήρθατε στο Price Quru
        </h1>
      </v-flex>
    </v-layout>

    <!-- <SearchBar /> -->
  </v-container>
</template>

<script>
import SearchBar from './SearchBar.vue';

export default {
  components: {
    SearchBar
  }
};
</script>

<style>
</style>
