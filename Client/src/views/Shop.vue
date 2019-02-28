<template>
  <div>
    <v-layout>
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
    </v-layout>
    <v-layout>

      <v-flex
        xs10
        sm10
        offset-xs-1
        offset-sm1>
        <h2 v-if="!shop && !loading">Το κατάστημα που ζητήσατε δε βρέθηκε</h2>
      </v-flex>
    </v-layout>

    <v-layout>

      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
      >  <v-card v-if="shop">
        <v-card-title>{{ shop.name }}</v-card-title>
        <v-card-text>{{ shop.address }}</v-card-text>
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
    <v-layout>
      <v-flex
        xs10
        sm10
        offset-xs1
        offset-sm1>
        <GmapMap
          :center="{lng: +shop.lng, lat:+shop.lat}"
          :zoom="10"
          v-if="shop"
          :options="options"
          style="width: 100%; height: 500px; margin: 50px auto;"

        >
          <GmapMarker
            :position="{lng: +shop.lng, lat:+shop.lat}"
            clickable
          />
          <GmapMarker
            v-if="currentLocation"
            :position="currentLocation"
            icon="images/home.png"
          />
        </GmapMap>

    </v-flex></v-layout>
  </v-layout></div>

</template>

<script>
import { gmapApi } from 'vue2-google-maps';

import shopsService from '../services/shops-service';
import geolocation from '../services/geolocation';

export default {
  props: {
    id: {
      required: true,
      type: String,
    }
  },
  data() {
    return {
      loading: false,
      shop: null,
      currentLocation: null,
      options: {
        mapTypeControl: false,
        minZoom: 5,
        streetViewControl: false
      },
    };
  },
  mounted() {
    this.fetchData();
    this.getCurrentLocation();
  },
  computed: {
    google: gmapApi
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
        const shop = (await shopsService.getShop(this.id)).data;
        this.shop = shop;
      } catch (err) {
        console.error(err);
        this.shop = null;
      } finally {
        this.loading = false;
      }
    },
    async getCurrentLocation() {
      try {
        const result = await geolocation.getCurrentLocation();
        console.log(result);
        this.currentLocation = {
          lat: result.coords.latitude,
          lng: result.coords.longitude
        };
      } catch (err) {
        console.error(err);
      }
    }
  },

};
</script>
