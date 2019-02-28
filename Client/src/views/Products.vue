<template>
  <div>

    <v-layout justify-start>

      <v-btn
        v-if="isAuthenticated"
        @click="addProduct"
        fab
        icon
      >
        <v-icon>add_circle</v-icon>
      </v-btn>
    </v-layout>

    <!-- <SearchBar /> -->
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
        <v-select
          :items="statusOptions"
          :value="status"
          label="Κατάσταση Προιόντος"
          @change="updateStatusOptions"
        />
      </v-flex>
    </v-layout>
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
    <v-layout
      wrap
      v-if="fetchedData.products"
    >

      <v-flex
        v-for="product in fetchedData.products"
        :key="product.id"
        xs10
        sm4
        offset-xs1
        offset-sm4
      >
        <v-card
          @click="viewProduct(product.id)"
          class="clickable"
        >
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-text>{{ product.category }}</v-card-text>
          <v-card-text>{{ product.description }}</v-card-text>
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
import { mapState, mapGetters } from 'vuex';

import AddProductModal from '../components/AddProductModal.vue';
import SearchBar from '../components/SearchBar.vue';
import productsService from '../services/products-service';

const productsPerPage = 15;
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
    },
    status: {
      default: 'active',
      type: String
    }
  },
  data() {
    return {
      loading: false,
      newProductModalVisible: false,
      perPage: 10,
      sortOptions: [
        { value: 'id', text: 'ID' },
        { value: 'name', text: 'Όνομα' }
      ],
      fetchedData: {},
      statusOptions: [
        { value: 'all', text: 'Όλα' },
        { value: 'active', text: 'Ενεργά' },
        { value: 'withdrawn', text: 'Αποσυρμένα' }],
      numberOfPages: 1
    };
  },
  watch: {
    $route() {
      this.fetchProducts();
    }
  },
  mounted() {
    this.fetchProducts();
  },
  computed: {
    sortOrderIcon() {
      return this.sortOrder.toLowerCase() === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
    },
    ...mapState({
      ...mapGetters(['isAuthenticated'])
    })
  },
  methods: {
    fetchProducts() {
      this.loading = true;
      productsService.getProducts({
        start: productsPerPage * (this.page - 1),
        sort: `${this.sortBy}|${this.sortOrder}`,
        count: this.perPage,
        status: this.status
      }).then((res) => {
        console.log(res.data);
        this.fetchedData = res.data;
        this.numberOfPages = Math.ceil(res.data.total / productsPerPage);
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
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
    updateStatusOptions(status) {
      this.$router.push({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          status
        }
      });
    },
    viewProduct(id) {
      this.$router.push({
        name: 'product',
        params: {
          id
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
