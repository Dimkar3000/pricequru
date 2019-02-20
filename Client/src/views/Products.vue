<template>
  <div>

    <v-layout justify-center>

      <h2>{{ filteredProducts.length }} Προϊόντα</h2>
    </v-layout>

    <v-layout justify-start>

      <v-btn
        @click="addProduct"
        fab
        icon
      >
        <v-icon>add_circle</v-icon>
      </v-btn>
    </v-layout>

    <SearchBar />
    <v-layout justify-center>
      <v-pagination
        :value="page"
        :length="numberOfPages"
        @input="changePage"
      />
    </v-layout>
    <v-layout
      justify-center
      row
    >
      <v-flex shrink>
        <v-select
          :items="sortOptions"
          :value="sortBy"
          label="Ταξινόμηση"
          :prepend-inner-icon="sortOrderIcon"
          @change="updateSorting"
        />
      </v-flex>
    </v-layout>
    <v-layout wrap>

      <v-flex
        xs10
        sm4
        v-for="product in paginatedProducts"
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

    <v-layout justify-center>
      <v-pagination
        :value="page"
        :length="numberOfPages"
        @input="changePage"
      />
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
import productsService from '../services/products-service';

export default {
  components: {
    AddProductModal,
    SearchBar
  },
  props: {
    page: {
      default: 1,
      type: Number
    },
    query: {
      default: '',
      type: String
    },
    sortBy: {
      default: 'id',
      type: String
    },
    sortOrder: {
      default: 'asc',
      type: String
    }
  },
  data() {
    return {
      newProductModalVisible: false,
      perPage: 10,
      sortOptions: [{ value: 'id', text: 'Προεπιλεγμένη Ταξινόμηση' }, { value: 'name', text: 'Όνομα' }, { value: 'price', text: 'Τιμή' }]
    };
  },
  mounted() {
    productsService.getAll().then((res) => { return console.log(res.data); });
  },
  computed: {
    filteredProducts() {
      const query = this.query.toLowerCase();
      return this.products.filter((p) => { return p.name.toLowerCase().includes(query); });
    },
    numberOfPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
    paginatedProducts() {
      return this.sortedResults.slice((this.page - 1) * this.perPage, this.page * this.perPage);
    },
    sortOrderIcon() {
      return this.sortOrder.toLowerCase() === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
    },
    sortedResults() {
      const order = this.sortOrder.toLowerCase() === 'asc' ? 1 : -1;
      return this.filteredProducts.slice().sort((a, b) => {
        return (a[this.sortBy] > b[this.sortBy]) ? order : -order;
      });
    },
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
    changePage(page) {
      this.$router.push({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          page
        }
      });
    },
    getLocalUrl(product) {
      const urlParts = product.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return `images/${fileName}`;
    },
    newProductModalClosed() {
      this.newProductModalVisible = false;
    },
    updateSorting(sortBy) {
      let sortOrder;
      let page = this.page;
      if (sortBy === this.sortBy) {
        sortOrder = this.sortOrder.toLowerCase() === 'asc' ? 'desc' : 'asc';
      } else {
        sortOrder = this.sortOrder;
        page = 1;
      }
      this.$router.push({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          page,
          sort: `${sortBy}|${sortOrder}`
        }
      });
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
.v-pagination {
  margin: 20px auto;
}

.v-select {
  margin: 20px auto;
}
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
