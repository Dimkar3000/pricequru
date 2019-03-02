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
        <v-form
          @submit.prevent="save"
          ref="form">
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
import LaptopFormPartial from './LaptopFormPartial.vue';
import SmartphoneFormPartial from './SmartphoneFormPartial.vue';

import productsService from '../services/products-service';

export default {
  components: {
    LaptopFormPartial,
    SmartphoneFormPartial
  },
  props: {
    open: {
      default: false,
      type: Boolean,
    }
  },
  data() {
    return {
      busy: false,
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
  watch: {
    open() {
      this.$refs.form.reset();
    }
  },
  computed: {
    additionalFieldsComponent() {
      switch (this.product.category) {
        case 'laptop': return 'LaptopFormPartial';
        case 'smartphone': return 'SmartphoneFormPartial';
        default: return '';
      }
    },
    ...mapState({ token: (state) => { return state.user.token; } })

  },
  methods: {
    modalClosed() {
      this.$emit('closed');
    },
    async save() {
      if (this.busy) {
        return;
      }
      this.busy = false;
      const data = {
        ...this.product,
        ...this.productAdditionalInfo
      };
      console.log(data);
      try {
        const product = (await productsService.createProduct(data, this.token)).data;
        this.$router.push({
          name: 'product',
          params: {
            id: product.id
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
