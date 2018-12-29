<template>
  <div>
    <h2> {{ shops.length }} Καταστήματα</h2>
    <v-tabs v-model="activeTab">
      <v-tab key="1">Λιστα</v-tab>
      <v-tab key="2">Χαρτης</v-tab>
      <v-tab-item key="1">

        <ShopsList :shops="shops" />
      </v-tab-item>
      <v-tab-item>
        <ShopsMap :shops="shops" />
      </v-tab-item>
    </v-tabs>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import ShopsList from '../components/ShopsList.vue';
import ShopsMap from '../components/ShopsMap.vue';

export default {
  components: {
    ShopsList,
    ShopsMap
  },
  data() {
    return {
      activeTab: null,
    };
  },
  computed: {
    ...mapState({
      shops: (state) => { return state.shops.all; }
    })
  }
};
</script>
