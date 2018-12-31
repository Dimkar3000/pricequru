<template>
  <div>
    <span>
      Αναζητήσατε τον όρο "{{ query }}"
    </span>
    <h2>{{ products.length }} Προϊόντα</h2>
    <v-btn
      @click="addProduct"
      fab
      icon
    >
      <v-icon>add_circle</v-icon>
    </v-btn>
    <SearchBar />
    <v-layout wrap>
      <v-flex
        xs10
        sm4
        v-for="(product) in products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()))"
        :key="product.name"
        offset-xs1
        offset-sm4
      >
        <v-card>
          <v-img
            :src="getLocalUrl(product)"
            contain
            height="200px"
            class="clickable"
            @click="viewProject(product)"
          />
          <v-card-title
            primary-title
            class="clickable product-name"
            @click="viewProject(product)"
          >{{ product.name }}</v-card-title>
          <v-card-text>
            <div
              v-for="key in Object.keys(product.specs)"
              :key="key"
              class="spec"
            >
              <span>{{ key }}:</span>
              <span> {{ product.specs[key] }}</span>
            </div>
          </v-card-text>
          <v-rating
            :value="5*Math.random()"
            readonly
            half-increments
          />

          <v-card-text>
            <span class="product-price">{{ product.price }}€</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <AddProductModal
      :open="newProductModalVisible"
      @closed="newProductModalClosed"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AddProductModal from '../components/AddProductModal.vue';
import SearchBar from '../components/SearchBar.vue';

export default {
  components: {
    AddProductModal,
    SearchBar
  },
  props: {
    query: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      newProductModalVisible: false
    };
  },
  computed: {
    ...mapState({
      products: (state) => {
        return state.products.all;
      }
    })
  },
  methods: {
    addProduct() {
      this.newProductModalVisible = true;
    },
    getLocalUrl(product) {
      const urlParts = product.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return `images/${fileName}`;
    },
    newProductModalClosed() {
      this.newProductModalVisible = false;
    },
    viewProject(product) {
      this.$router.push({
        name: 'product',
        params: {
          id: product.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  margin-bottom: 50px;
  padding-top: 20px;
  text-align: center;

  &__title {
    justify-content: center;
  }

  .product-name {
    font-size: 2rem;
  }
  .spec {
    display: flex;
    justify-content: space-between;
  }

  .product-price {
    text-align: center;
    font-size: 2rem;
  }
}
</style>
