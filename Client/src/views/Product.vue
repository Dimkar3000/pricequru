<template>
  <div>
    <v-layout justify-center>
      <v-btn
        :loading="removingProduct"
        v-if="token"
        @click="removeProduct"
      >{{ isAdmin?'Διαγραφη':'Αποσυρση' }}
      </v-btn>
      <v-btn
        v-if="token"
        @click="addingPrice=true"
      >Προσθηκη τιμης
      </v-btn>
      <v-btn
        v-if="token"
        @click="editingProduct=true"
      >Επεξεργασια
      </v-btn>
    </v-layout>

    <v-layout>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
        class="loading-container"
        v-if="loadingProduct"
      >
        <v-progress-circular indeterminate />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex
        xs10
        sm10
        offset-xs-1
        offset-sm1
      >
        <h2 v-if="!product && !loadingProduct">Το προϊόν που ζητήσατε δε βρέθηκε</h2>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
      >

        <v-card v-if="product">
          <v-card-title
            primary-title
            class="title"
          >{{ product.name }}</v-card-title>
          <v-card-text class='capitalize'>{{ product.category }}</v-card-text>
          <v-card-text>{{ product.description }} </v-card-text>
          <v-card-text
            v-for="(extraDatum, i) in extraData"
            :key="i"
          >
            <span class="m-r">{{ extraDatum.label }}:</span>
            <span>{{ extraDatum.value }}</span>
          </v-card-text>
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
    <v-layout>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
        class="loading-container"
        v-if="loadingPrices"
      >
        <v-progress-circular indeterminate />
      </v-flex>
    </v-layout>
    <v-list v-if="isProductAvailable">
      <v-list-tile
        v-for="price in prices.prices"
        :key="price.id"
      >

        <v-list-tile-content>
          <v-list-tile-title
            @click="viewShop(price.shopId)"
            v-text="price.shopName"
            class="clickable"
          />
          <v-list-tile-sub-title>{{ price.price }}€</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <AddPriceModal
      :open="addingPrice"
      @closed="addingPrice=false"
      :initial-product-id="id"
    />
    <AddProductModal
      v-if="this.product"
      :open="editingProduct"
      @closed="editingProduct=false"
      :product-to-edit="this.product"
      @product-edited="productEdited"
    />
  </div>

</template>

<script>
import { mapState } from 'vuex';

import AddPriceModal from '../components/AddPriceModal.vue';
import AddProductModal from '../components/AddProductModal.vue';
import labels from '../helpers/extra-data-labels';
import pricesService from '../services/prices-service';
import productsService from '../services/products-service';

export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    AddPriceModal,
    AddProductModal
  },
  name: 'Product',
  data() {
    return {
      addingPrice: false,
      editingProduct: false,
      loadingPrices: false,
      loadingProduct: false,
      prices: [],
      product: null,
      removingProduct: false
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
  computed: {
    extraData() {
      if (!this.product || !this.product.extraData) { return []; }
      const keys = Object.keys(this.product.extraData);
      return keys.map((key) => {
        return {
          label: labels[key],
          value: this.product.extraData[key]
        };
      });
    },
    isProductAvailable() {
      return this.prices && this.prices.prices && this.prices.prices.length > 0;
    },
    isProductUnavailable() {
      return this.prices && this.prices.prices && this.prices.prices.length === 0;
    },
    ...mapState({
      isAdmin: (state) => { return state.user.isAdmin; },
      token: (state) => { return state.user.token; }
    })
  },
  methods: {
    async fetchData() {
      this.loadingProduct = true;
      try {
        const product = (await productsService.getProduct(this.id)).data;
        console.log(product);
        this.product = product;
      } catch (err) {
        console.error(err);
        this.product = null;
      } finally {
        this.loadingProduct = false;
      }
      if (this.product) {
        this.loadingPrices = true;
        try {
          const data = (await pricesService.getPricesForProduct({
            start: 0,
            count: 500,
            productId: this.id,
            sort: 'price|asc'
          })).data;

          this.prices = data;
        } catch (err) {
          console.error(err);
        } finally {
          console.log();
          this.loadingPrices = false;
        }
      }
    },
    getLabel(key) {
      return labels(key);
    },
    getLocalUrl(product) {
      const urlParts = product.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return `images/${fileName}`;
    },
    async removeProduct() {
      if (this.removingProduct) {
        return;
      }
      this.removingProduct = true;
      try {
        await productsService.removeProduct(this.id, this.token);
        this.$router.push({
          name: 'products'
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.removeProduct = false;
      }
    },
    productEdited(product) {
      console.log('edited');
      this.product = product;
    },
    viewShop(shopId) {
      this.$router.push({
        name: 'shop',
        params: {
          id: shopId
        }
      });
    }
  }
};
</script>
