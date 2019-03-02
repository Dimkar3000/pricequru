<template>
  <v-dialog
    v-model="open"
    persistent
    @keydown.esc="modalClosed"
    class="login-modal"
  >
    <v-card>

      <span>Προσθήκη νέας τιμής</span>
      <v-btn
        @click="modalClosed"
        class="right"
        fab
      >
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex
        xs-6
        xs-offset-3
        justify-center
      >
        <v-form
          @submit.prevent="save"
          ref="form"
        >
          <v-select
            :items="shops"
            label="Κατάστημα"
            :item-text="getDisplayText"
            :item-value="getValue"
            v-model="selectedShopId"
            :disabled="shopLocked"
            :loading="loadingShops"
            :rules="rules.shopId"
          />
          <v-select
            :items="products"
            label="Προϊόν"
            :item-text="getDisplayText"
            :item-value="getValue"
            v-model="selectedProductId"
            :disabled="productLocked"
            :loading="loadingProducts"
            :rules="rules.productId"
          />
          <v-text-field
            type="number"
            v-model="price"
            min="0"
            label="Τιμή (€)"
            append-icon="euro_symbol"
            :rules="rules.price"
          />
          <v-date-picker v-model="dateFrom">
            <span class="picker-title">Από</span>
          </v-date-picker>
          <v-date-picker v-model="dateTo">
            <span class="picker-title">Έως</span>
          </v-date-picker>

          <div class="map">
            <GmapMap
              :center="initialCenter"
              :zoom="7"
              map-type-id="terrain"
              style="width: 100%; height: 40vh; margin: 50px auto;"
              :options="options"
              ref="map"
            >
              <GmapMarker
                v-for="shop in shops"
                :key="shop.id"
                :position="shop"
                :clickable="!shopLocked"
                @click="shopMarkerClicked(shop)"
              >
                <GmapInfoWindow v-if="selectedShopId==shop.id">
                  <h2 class="black-text">{{ shop.name }}</h2>
                </GmapInfoWindow>
              </GmapMarker>
            </GmapMap>
          </div>

          <v-btn
            :loading="busy"
            type="submit"
          >Προσθηκη
          </v-btn>
        </v-form>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapState } from 'vuex';
import { gmapApi } from 'vue2-google-maps';

import { formatDate } from '../helpers/dates';
import geolocation from '../services/geolocation';
import pricesService from '../services/prices-service';
import productsService from '../services/products-service';
import shopsService from '../services/shops-service';

const priceRule = (price) => {
  return price > 0 || 'Η τιμή του προϊόντος πρέπει να είναι θετικός αριθμός.';
};
const productRule = (value) => {
  return value != null || 'Παρακαλώ επιλέξτε ένα κατάστημα.';
};

const shopRule = (value) => {
  return value != null || 'Παρακαλώ επιλέξτε ένα προϊόν.';
};

export default {
  data() {
    return {
      busy: false,
      dateFrom: formatDate(new Date()),
      dateTo: formatDate(new Date()),
      gettingCoordinates: false,
      initialCenter: {
        lat: 10,
        lng: 10
      },
      loadingProducts: false,
      loadingShops: false,
      options: {
        mapTypeControl: false,
        minZoom: 5,
        streetViewControl: false
      },
      price: 0,
      productLocked: false,
      products: [],
      rules: {
        price: [priceRule],
        productId: [productRule],
        shopId: [shopRule],
      },
      selectedPosition: {
        lat: 10,
        lng: 10
      },
      selectedProductId: null,
      selectedShopId: null,
      shopLocked: false,
      shops: []
    };
  },
  props: {
    initialShopId: {
      type: String,
      required: false,
      default: null
    },
    initialProductId: {
      type: String,
      required: false,
      default: null
    },
    open: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState({ token: (state) => { return state.user.token; } }),
    google: gmapApi
  },
  mounted() {
    this.fetchData();
  },
  methods: {

    async centerMap() {
      console.log(this.google);

      this.$refs.map.$mapPromise.then((map) => {
        const bounds = new this.google.maps.LatLngBounds();
        this.shops.forEach((shop) => {
          bounds.extend(shop);
        });
        map.fitBounds(bounds);
      });
    },
    dragEnd(e) {
      this.selectedPosition.lat = e.latLng.lat();
      this.selectedPosition.lng = e.latLng.lng();
    },
    fetchData() {
      this.loadingProducts = true;
      this.loadingShops = true;
      productsService.getAllProducts().then((products) => {
        this.products = products;
      }).catch((err) => {
        console.error(err);
      })
        .finally(() => {
          this.loadingProducts = false;
        });

      shopsService.getAllShops().then((shops) => {
        this.shops = shops;
        this.centerMap();
      }).catch((err) => {
        console.error(err);
      })
        .finally(() => {
          this.loadingShops = false;
        });
    },
    initializeSelections() {
      this.productLocked = this.initialProductId !== null;
      this.shopLocked = this.initialShopId !== null;
      this.selectedShopId = this.initialShopId;
      this.selectedProductId = this.initialProductId;
    },
    async getCoordinatesFromAddress() {
      if (this.gettingCoordinates || !this.shop.address) {
        return;
      } this.gettingCoordinates = true;
      try {
        const result = await geolocation.geocodeAddress(this.shop.address);
        const data = result.data;
        if (data.results && data.results[0] && data.results[0].geometry && data.results[0].geometry.location) {
          const { lat, lng } = data.results[0].geometry.location;
          console.log({ lat, lng });
          this.initialCenter = {
            lat, lng
          };
          this.selectedPosition = {
            lat, lng
          };
        } else { throw (new Error()); }
        console.log(result);
      } catch (err) {
        console.error(err);
        this.$swal({
          type: 'error',
          text: 'Συγγνώμη, δεν μπορέσαμε να εντοπίσουμε τη διεύθυνση στο χάρτη.'
        });
      } finally {
        this.gettingCoordinates = false;
      }
    },
    getDisplayText(entity) {
      return entity.name;
    },
    getValue(entity) {
      return entity.id;
    },
    modalClosed() {
      this.$emit('closed');
    },
    async save() {
      if (this.busy || !this.$refs.form.validate()) {
        return;
      }
      const d1 = Date.parse(this.dateFrom);
      const d2 = Date.parse(this.dateTo);
      if (d2 < d1) {
        this.$swal({
          type: 'error',
          text: 'Η δεύτερη ημερομηνία δεν μπορεί να προηγείται της πρώτης.'
        });
        return;
      }

      this.busy = true;
      const data = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        price: this.price,
        productId: this.selectedProductId,
        shopId: this.selectedShopId,
      };
      console.log(data);
      try {
        const price = (await pricesService.addPrice(data, this.token)).data;
        this.modalClosed();
        console.log(price);
      } catch (err) {
        console.error(err);
      } finally {
        this.busy = false;
      }
    },
    shopMarkerClicked(shop) {
      this.selectedShopId = shop.id;
    },
    updateAdditionalInfo(productAdditionalInfo) {
      this.productAdditionalInfo = productAdditionalInfo;
    }
  },
  watch: {
    open(newValue) {
      if (newValue) {
        this.initializeSelections();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  padding: 20px;
}
.right {
  float: right;
}

.picker-title {
  display: block;
  margin: auto;
  font-size: 2rem;
  font-weight: bold;
}
</style>
