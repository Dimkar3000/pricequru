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

    <v-layout>
      <v-flex mb-4>
        <v-form @submit.prevent="search">
          <v-text-field
            class="mx-3"
            flat
            label="Αναζήτηση"
            prepend-inner-icon="search"
            solo-inverted
            v-model="searchTerm"
          />
        </v-form>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => {
    return {
      searchTerm: ''
    };
  },
  methods: {
    search() {
      if (!this.searchTerm.trim()) {
        return;
      }
      this.$router.push({
        name: 'search',
        query: {
          q: this.searchTerm.trim()
        }
      });
    }
  }
};
</script>

<style>
</style>
