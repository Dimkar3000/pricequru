<template>
  <v-dialog
    v-model="open"
    persistent
    @keydown.esc="modalClosed"
    class="login-modal"
  >
    <v-card>

      <span>Προσθήκη νέου προϊόντος</span>
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
          <v-select
            :items="categories"
            v-model="product.category"
            label="Κατηγορία"
          />
          <v-text-field
            label="Όνομα"
            v-model="product.name"
            required
          />
          <v-textarea
            label="Περιγραφή"
            v-model="product.description"
          />
          <v-combobox
            label="Tags"
            v-model="product.tags"
            multiple
            small-chips
            deletable-chips
          />
          <v-divider />
          <component
            :is="additionalFieldsComponent"
            @change="updateAdditionalInfo"
          />
          <v-btn type="submit">Προσθηκη</v-btn>

        </v-form>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>

import LaptopFormPartial from './LaptopFormPartial.vue';
import SmartphoneFormPartial from './SmartphoneFormPartial.vue';

export default {
  components: {
    LaptopFormPartial,
    SmartphoneFormPartial
  },
  data() {
    return {
      categories:
        [
          { text: 'Laptop', value: 'laptop' },
          { text: 'Smartphone', value: 'smartphone' },
        ],
      product: {
        category: 'smartphone',
        description: '',
        name: '',
        tags: []
      },
      productAdditionalInfo: {}
    };
  },
  computed: {
    additionalFieldsComponent() {
      switch (this.product.category) {
        case 'laptop': return 'LaptopFormPartial';
        case 'smartphone': return 'SmartphoneFormPartial';
        default: return '';
      }
    }
  },
  methods: {
    modalClosed() {
      this.$emit('closed');
    },
    save() {
      const data = {
        ...this.product,
        ...this.productAdditionalInfo
      };
      console.log(data);
      alert(JSON.stringify(data));
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
