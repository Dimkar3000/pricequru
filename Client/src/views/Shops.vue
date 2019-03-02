<template>
  <div>
    <v-layout justify-center>

      <v-btn
        v-if="isAuthenticated"
        @click="addShop"
      >Προσθήκη καταστήματος
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
      <v-flex
        xs10
        sm4
        class="loading-container"
        v-if="loading"
      >
        <v-progress-circular indeterminate />
      </v-flex>
    </v-layout>
    <v-layout
      wrap
      v-if="fetchedData && fetchedData.shops"
    >

      <v-flex
        v-for="shop in fetchedData.shops"
        :key="shop.id"
        xs10
        sm4
        offset-xs1
        offset-sm4
      >
        <v-card
          @click="viewShop(shop.id)"
          class="clickable"
        >
          <v-card-title class="title">{{ shop.name }}</v-card-title>
          <v-card-text>{{ shop.category }}</v-card-text>
          <v-card-text>{{ shop.description }}</v-card-text>
          <v-chip
            v-for="tag in shop.tags"
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
    <AddShopModal
      :open="newShopModalVisible"
      @closed="newShopModalClosed"
    />
  </v-layout></div>
</template>

<script>
import { mapGetters } from 'vuex';

import AddShopModal from '../components/AddShopModal.vue';
import shopsService from '../services/shops-service';

const shopsPerPage = 20;

export default {
  props: {
    page: {
      required: true,
      type: Number
    }
  },
  name: 'Shops',
  components: {
    AddShopModal
  },
  data() {
    return {
      fetchedData: null,
      loading: false,
      newShopModalVisible: false,
      numberOfPages: 1
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    page() {
      this.fetchData();
    }
  },
  methods: {
    addShop() {
      this.newShopModalVisible = true;
    },
    async fetchData() {
      this.loading = true;
      try {
        const data = (await shopsService.getShops({
          count: shopsPerPage,
          start: shopsPerPage * (this.page - 1),

        })).data;
        this.numberOfPages = Math.ceil(data.total / shopsPerPage);
        this.fetchedData = data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
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
    newShopModalClosed() {
      this.newShopModalVisible = false;
    },
    viewShop(id) {
      this.$router.push({
        name: 'shop',
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
  margin-bottom: 30px;
}
</style>
