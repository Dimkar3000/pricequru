<template>
  <GmapMap
    :center="{lat:10, lng:10}"
    :zoom="7"
    map-type-id="terrain"
    style="width: 40vw; height: 20vh; margin: 50px auto;"
    :options="options"
    ref="map"
  >
    <GmapMarker
      draggable
      :position={lat:10,lng:10}
      @dragend="markerMoved"
    />
  </GmapMap>
</template>

<script>
export default {
  data() {
    return {
      options: {
        mapTypeControl: false,
        minZoom: 5,
        streetViewControl: false
      }
    };
  },
  methods: {
    markerMoved(position) {
      const coords = {
        lat: position.latLng.lat(),
        lng: position.latLng.lng()
      };
      this.$emit('changed', coords);
      console.log(coords);
    }
  }
};
</script>

