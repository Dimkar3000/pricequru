<template>
  <div>
    <h2>Προϊον {{ id }}</h2>
    <v-layout wrap>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
      >
        <v-card>
          <v-img
            :src="getLocalUrl(product)"
            contain
            height="200px"
          />
          <v-card-title primary-title>{{ product.name }}</v-card-title>
          <v-card-text>
            <div
              v-for="key in Object.keys(product.specs)"
              :key="key"
            >
              {{ key }} : {{ product.specs[key] }}</div>
          </v-card-text>
          <v-card-text>{{ product.price }}€</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapState({
      product(state) { return state.products.all[+this.id]; }
    })
  },
  methods: {
    getLocalUrl(product) {
      const urlParts = product.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return `images/${fileName}`;
    }
  }
};
</script>
