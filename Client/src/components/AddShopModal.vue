<template>
  <v-dialog
    v-model="open"
    persistent
    @keydown.esc="modalClosed"
    class="login-modal"
  >
    <v-card>

      <span>Προσθήκη νέου καταστήματος</span>
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
        <v-form @submit.prevent="save">
          <v-text-field
            label="Όνομα"
            v-model="shop.name"
            required
          />
          <v-text-field
            label="Διεύθυνση"
            v-model="shop.address"
            required
          />
          <v-combobox
            label="Tags"
            v-model="shop.tags"
            multiple
            small-chips
            deletable-chips
          />
          <div class="map">
            <GmapMap
              :center="initialCenter"
              :zoom="7"
              map-type-id="terrain"
              style="width: 100%; height: 40vh; margin: 50px auto;"
              :options="options"
              ref="map">
              <GmapMarker
                :position="initialCenter"
                draggable
                @dragend="dragEnd"
              />
            </GmapMap>
          </div>

          <v-btn
            :loading="busy"
            type="submit">Προσθηκη</v-btn>
        </v-form>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapState } from 'vuex';

import shopsService from '../services/shops-service';
import geolocation from '../services/geolocation';

export default {
  data() {
    return {
      busy: false,
      initialCenter: { lat: 10, lng: 10 },
      selectedPosition: { lat: 10, lng: 10 },
      shop: {
        description: '',
        name: '',
        tags: [],
        lat: 0,
        lng: 0,
        address: ''
      },
      options: {
        mapTypeControl: false,
        minZoom: 5,
        streetViewControl: false
      },
    };
  },
  computed: {
    ...mapState({ token: (state) => { return state.user.token; } })
  },
  mounted() {
    this.centerMap();
  },
  methods: {
    async centerMap() {
      try {
        const position = await geolocation.getCurrentLocation();
        console.log(position);
        this.initialCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.selectedPosition.lat = position.coords.latitude;
        this.selectedPosition.lng = position.coords.longitude;
      } catch (err) {
        console.error(err);
      }
    },
    dragEnd(e) {
      this.selectedPosition.lat = e.latLng.lat();
      this.selectedPosition.lng = e.latLng.lng();
    },
    modalClosed() {
      this.$emit('closed');
    },
    async save() {
      if (this.busy || !this.shop.name.trim()) {
        return;
      }
      this.busy = false;
      const data = {
        ...this.shop,
        ...this.selectedPosition
      };
      console.log(data);
      try {
        const shop = (await shopsService.createShop(data, this.token)).data;
        this.$router.push({
          name: 'shop',
          params: {
            id: shop.id
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.busy = false;
      }
    },
    updateAdditionalInfo(productAdditionalInfo) {
      this.productAdditionalInfo = productAdditionalInfo;
    }
  },
  props: {
    open: {
      default: false,
      type: Boolean,
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
</style>
