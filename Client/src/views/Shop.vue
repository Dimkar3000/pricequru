<template>
  <div>
    <v-layout justify-center>
      <v-btn @click="addingPrice=true">Προσθηκη τιμης
      </v-btn>
    </v-layout>

    <v-layout>
      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
        class="loading-container"
        v-if="loadingShop"
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
        <h2 v-if="!shop && !loadingShop">Το κατάστημα που ζητήσατε δε βρέθηκε</h2>
      </v-flex>
    </v-layout>

    <v-layout>

      <v-flex
        xs10
        sm4
        offset-xs1
        offset-sm4
      >
        <v-card v-if="shop">
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
        offset-sm1
      >

        <v-expansion-panel>
          <v-expansion-panel-content :key="0">
            <template slot="header">
              <div>
                Λίστα προϊόντων
              </div>
            </template>
            <v-list>
              <v-list-tile
                v-for="price in prices.prices"
                :key="price.id"
              >

                <v-list--content>
                  <v-list-tile-title
                    class="clickable"
                    @click="viewProduct(price.productId)"
                    v-text="price.productName"
                  />
                  <v-list-tile-sub-title>{{ price.price }}€</v-list-tile-sub-title>
                </v-list--content>
              </v-list-tile>
            </v-list>
          </v-expansion-panel-content>
          <v-expansion-panel-content :key="1">
            <template slot="header">
              <div>Προβολή καταστήματος στο χάρτη</div>
            </template>

            <GmapMap
              :center="{lng: +shop.lng, lat:+shop.lat}"
              :zoom="10"
              v-if="shop"
              :options="options"
              style="width: 100%; height: 500px; margin: 50px auto;"
            >
              <GmapMarker :position="{lng: +shop.lng, lat:+shop.lat}" />
            </GmapMap>
          </v-expansion-panel-content>

        </v-expansion-panel>

      </v-flex>
    </v-layout>
    <AddPriceModal
      :open="addingPrice"
      @closed="addingPrice=false"
      :initial-shop-id="id"
    />
  </div>

</template>

<script>
import { gmapApi } from 'vue2-google-maps';

import AddPriceModal from '../components/AddPriceModal.vue';
import pricesService from '../services/prices-service';
import shopsService from '../services/shops-service';
import geolocation from '../services/geolocation';

export default {
  props: {
    id: {
      required: true,
      type: String,
    }
  },
  name: 'Shop',
  components: {
    AddPriceModal
  },
  data() {
    return {
      addingPrice: false,
      currentLocation: null,
      loadingShop: false,
      options: {
        mapTypeControl: false,
        minZoom: 5,
        streetViewControl: false
      },
      prices: {
        prices: []
      },
      shop: null
    };
  },
  mounted() {
    this.fetchData();
    this.getCurrentLocation();
  },
  computed: {
    google: gmapApi,
  },
  watch: {
    id() {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      this.loadingShop = true;
      try {
        const shop = (await shopsService.getShop(this.id)).data;
        this.shop = shop;
        const prices = (await pricesService.getPricesForShop({
          start: 0,
          count: 500,
          shopId: this.id
        })).data;
        this.prices = prices;
      } catch (err) {
        console.error(err);
        this.shop = null;
      } finally {
        this.loadingShop = false;
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
    },
    viewProduct(productId) {
      this.$router.push({
        name: 'product',
        params: {
          id: productId
        }
      });
    }
  },

};
</script>
