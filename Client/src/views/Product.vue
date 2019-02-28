<template>
  <div>
    <v-layout wrap>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
        class="loading-container"
        v-if="loading"
      >
        <v-progress-circular indeterminate />
      </v-flex>
      <v-flex
        xs10
        sm10
        offset-xs-1
        offset-sm1>
        <h2 v-if="!product && !loading">Το προϊόν που ζητήσατε δε βρέθηκε</h2>
      </v-flex>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
      >

        <v-card v-if="product">
          <!-- <v-img
            :src="getLocalUrl(product)"
            contain
            height="200px"
          /> -->
          <v-card-title primary-title>{{ product.name }}</v-card-title>
          <v-card-text>{{ product.category }}</v-card-text>
          <v-card-text>{{ product.description }} </v-card-text>
          <v-chip
            v-for="tag in product.tags"
            :key="tag"
            outline
          >
            {{ tag }}
          </v-chip>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import productsService from '../services/products-service';

export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      loading: false,
      product: null
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    id() {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const product = (await productsService.getProduct(this.id)).data;
        console.log(product);
        this.product = product;
      } catch (err) {
        console.error(err);
        this.product = null;
      } finally {
        this.loading = false;
      }
    },
    getLocalUrl(product) {
      const urlParts = product.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return `images/${fileName}`;
    }
  }
};
</script>
