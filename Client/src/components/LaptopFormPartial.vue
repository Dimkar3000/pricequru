<template>
  <div>
    <v-text-field
      type="number"
      label="Οθόνη (Ίντσες)"
      v-model.number="product.screenSize"
      min="0"
    />
    <v-text-field
      label="Ανάλυση Οθόνης"
      v-model="product.screenResolution"
    />
    <v-text-field
      label="Λειτουργικό Σύστημα"
      v-model="product.operatingSystem"
    />
    <v-text-field
      label="Επεξεργαστής"
      v-model.number="product.cpu"
    />

    <v-text-field
      label="Κάρτα Γραφικών"
      v-model="product.gpu"
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
        cpu: '',
        gpu: '',
        operatingSystem: '',
        ram: '',
        screenResolution: '',
        screenSize: '',
        storage: ''
      }
    };
  }

};
</script>
