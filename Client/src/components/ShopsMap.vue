<template>
  <GmapMap
    :center="{lat:10, lng:10}"
    :zoom="7"
    map-type-id="terrain"
    style="width: 100%; height: 80vh; margin: 50px auto;"
    :options="options"
    ref="map"
  >
    <GmapMarker
      :key="index"
      v-for="(shop, index) in shops"
      :position="{lng: +shop.long, lat:+shop.lat}"
      :clickable="true"
      @click="selectShop(shop)"
    >
      <GmapInfoWindow v-if="selectedShop===shop">
        <span>{{ shop.name }}</span>
      </GmapInfoWindow>
    </GmapMarker>
  </GmapMap>
</template>

<script>
import { gmapApi } from 'vue2-google-maps';

function getPosition(shop) {
  return {
    lng: +shop.long,
    lat: +shop.lat
  };
}
export default {
  data() {
    return {
      options: {
        mapTypeControl: false,
        minZoom: 5,
        streetViewControl: false
      },
      selectedShop: null
    };
  },
  computed: {
    google: gmapApi
  },
  mounted() {
    this.fitToBounds();
  },
  methods: {
    getPosition,
    fitToBounds() {
      /*
    if (!this.google) {
      console.log('no google');
      return;
    }
    console.log('fitting');
    const bounds = new this.google.maps.LatLngBounds();
    const coords = this.shops.map((shop) => {
      return {
        lat: +shop.lat,
        lng: +shop.long
      };
    });
    coords.forEach((coord) => {
      bounds.extend(coord);
    });
*/
      this.$refs.map.$mapPromise.then((map) => {
        if (!this.google) {
          console.log('no google');
          return;
        }
        console.log(`fitting to ${this.shops.length} shops`);
        const bounds = new this.google.maps.LatLngBounds();
        const coords = this.shops.map(getPosition);
        coords.forEach((coord) => {
          bounds.extend(coord);
        });
        map.fitBounds(bounds);
      });
    },
    selectShop(shop) {
      this.selectedShop = shop;
      this.$refs.map.$mapPromise.then((map) => {
        map.panTo(this.getPosition(shop));
      });
    }
  },
  props: {
    shops: {
      required: true,
      type: Array
    }
  }
};
</script>

<style lang="scss">
.gm-style-iw {
  color: #333;
}
</style>

