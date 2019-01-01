<template>
  <div>
    <v-text-field
      type="number"
      label="Οθόνη (Ίντσες)"
      v-model.number="product.screenSize"
      min="0"
    />
    <v-text-field
      type="number"
      label="RAM (GB)"
      v-model.number="product.ram"
      min="0"
    />
    <v-text-field
      label="Αποθηκευτικός Χώρος (GB)"
      type="number"
      v-model.number="product.storage"
      min="0"
    />
    <v-text-field
      label="Βασική κάμερα (MP)"
      type="number"
      v-model.number="product.camera"
      min="0"
    />
    <v-text-field
      label="Πίσω κάμερα (MP)"
      type="number"
      v-model.number="product.selfieCamera"
      min="0"
    />
    <v-text-field
      label="Πυρήνες CPU"
      type="number"
      v-model.number="product.cpuCores"
      min="1"
    />
  </div>
</template>
<script>
import ProductFormPartial from '../mixins/ProductFormPartial.vue';

export default {
  mixins: [
    ProductFormPartial
  ],
  data() {
    return {
      product: {
        camera: '',
        cpuCores: '',
        ram: '',
        screenSize: '',
        selfieCamera: '',
        storage: ''

      }
    };
  }
};
</script>
