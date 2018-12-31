<template>
  <v-layout>
    <v-flex mb-4>
      <v-form @submit.prevent="search">
        <v-autocomplete
          class="mx-3"
          flat
          label="Αναζήτηση"
          prepend-inner-icon="search"
          solo-inverted
          v-model="searchTerm"
          :items="productNames"
          :item-text="p=>p"
          dont-fill-mask-blanks
          ref="auto"
          @change="viewSelected"
        />
      </v-form>
    </v-flex>

  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      searchTerm: ''
    };
  },
  computed: {
    ...mapState({
      productNames: (state) => {
        return state.products.all.map((p) => { return p.name; });
      }
    })
  },
  methods: {

    search() {
      const searchTerm = this.$refs.auto.lazySearch ? this.$refs.auto.lazySearch.trim() : null;
      if (!searchTerm) {
        return;
      }
      this.$router.push({
        name: 'products',
        query: {
          q: searchTerm
        }
      });
    },
    viewSelected(name) {
      this.$router.push({
        name: 'products',
        query: {
          q: name
        }
      });
    },
  }
};
</script>

