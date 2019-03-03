<template>
  <v-dialog
    v-model="open"
    persistent
    @keydown.esc="modalClosed"
    class="login-modal"
  >
    <v-card>

      <span>{{ modalTitle }}</span>
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
            :items="categories"
            v-model="product.category"
            label="Κατηγορία"
            :rules="rules.category"
          />
          <v-text-field
            label="Όνομα"
            v-model="product.name"
            :rules="rules.name"
          />
          <v-textarea
            label="Περιγραφή"
            v-model="product.description"
            :rules="rules.description"
          />
          <v-combobox
            label="Tags"
            v-model="product.tags"
            multiple
            small-chips
            deletable-chips
          />
          <v-divider />
          <template v-if="product.category==='smartphone'">
            <v-text-field
              type="number"
              label="Οθόνη (Ίντσες)"
              v-model.number="extraData.smartphone.screenSize"
              min="0"
            />
            <v-text-field
              type="number"
              label="RAM (GB)"
              v-model.number="extraData.smartphone.ram"
              min="0"
            />
            <v-text-field
              label="Αποθηκευτικός Χώρος (GB)"
              type="number"
              v-model.number="extraData.smartphone.storage"
              min="0"
            />
            <v-text-field
              label="Βασική κάμερα (MP)"
              type="number"
              v-model.number="extraData.smartphone.camera"
              min="0"
            />
            <v-text-field
              label="Πίσω κάμερα (MP)"
              type="number"
              v-model.number="extraData.smartphone.selfieCamera"
              min="0"
            />
            <v-text-field
              label="Πυρήνες CPU"
              type="number"
              v-model.number="extraData.smartphone.cpuCores"
              min="1"
            />
          </template>

          <template v-if="product.category==='laptop'">
            <v-text-field
              type="number"
              label="Οθόνη (Ίντσες)"
              v-model.number="extraData.laptop.screenSize"
              min="0"
            />
            <v-text-field
              label="Ανάλυση Οθόνης"
              v-model="extraData.laptop.screenResolution"
            />
            <v-text-field
              label="Λειτουργικό Σύστημα"
              v-model="extraData.laptop.operatingSystem"
            />
            <v-text-field
              label="Επεξεργαστής"
              v-model.number="extraData.laptop.cpu"
            />

            <v-text-field
              label="Κάρτα Γραφικών"
              v-model="extraData.laptop.gpu"
            />
            <v-text-field
              type="number"
              label="RAM (GB)"
              v-model.number="extraData.laptop.ram"
              min="0"
            />
            <v-text-field
              label="Αποθηκευτικός Χώρος (GB)"
              type="number"
              v-model.number="extraData.laptop.storage"
              min="0"
            />
          </template>

          <v-btn
            :loading="busy"
            type="submit"
          >{{ buttonLabel }}</v-btn>

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

const categoryRule = (category) => {
  return category != null || 'Παρακαλώ επιλέξτε μια κατηγορία.';
};

const descriptionRule = (description) => {
  return (description != null && description.trim() != '') ||
    'Η περιγραφή του προϊόντος είναι υποχρεωτικό πεδίο.';
};
const productRule = (text) => {
  return (text != null && text.trim() !== '') ||
    'Το όνομα του προϊόντος είναι υποχρεωτικό πεδίο.';
};
export default {
  components: {
    LaptopFormPartial,
    SmartphoneFormPartial
  },
  props: {
    open: {
      default: false,
      type: Boolean
    },
    productToEdit: {
      default: () => { return {}; },
      required: false,
      type: Object
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
      extraData: {
        laptop: {
          cpu: null,
          gpu: null,
          operatingSystem: null,
          ram: null,
          screenResolution: null,
          screenSize: null,
          storage: null
        },
        smartphone: {
          camera: null,
          cpuCores: null,
          ram: null,
          screenSize: null,
          selfieCamera: null,
          storage: null
        }
      },
      product: {
        category: 'smartphone',
        description: '',
        name: '',
        tags: []
      },
      rules: {
        category: [categoryRule],
        description: [descriptionRule],
        name: [productRule]
      }
    };
  },
  watch: {
    open(newValue) {
      if (newValue) {
        this.initializeData();
      }
    }
  },
  computed: {
    buttonLabel() {
      return this.editingProduct ?
        'Αποθηκευση' :
        'Προσθκηκη';
    },
    editingProduct() {
      return this.productToEdit && this.productToEdit.id != undefined;
    },
    modalTitle() {
      return this.editingProduct ?
        'Επεξεργασία προϊόντος' :
        'Προσθήκη νέου προϊόντος';
    },
    selectedExtraData() {
      return this.product.category === 'laptop' ?
        this.extraData.laptop :
        this.extraData.smartphone;
    },
    ...mapState({ token: (state) => { return state.user.token; } })

  },
  methods: {
    clearValidation() {
      console.log('clear');
      this.$refs.form.resetValidation();
    },
    initializeData() {
      if (!this.editingProduct) {
        this.$refs.form.reset();
        // return;
      }
      this.product.category = this.productToEdit.category;
      this.product.description = this.productToEdit.description;
      this.product.name = this.productToEdit.name;
      this.product.tags = this.productToEdit.tags;
      this.extraData[this.productToEdit.category] = this.productToEdit.extraData;
    },
    modalClosed() {
      this.$emit('closed');
    },
    async save() {
      if (this.busy || !this.$refs.form.validate()) {
        return;
      }
      this.busy = false;
      const data = {
        ...this.product,
        extraData: this.selectedExtraData
      };
      console.log({ data });
      try {
        if (this.editingProduct) {
          data.id = this.productToEdit.id;
          const product = (await productsService.editProduct(data, this.token)).data;
          this.$emit('product-edited', product);
          this.modalClosed();
        } else {
          const product = (await productsService.createProduct(data, this.token)).data;
          this.$router.push({
            name: 'product',
            params: {
              id: product.id
            }
          });
        }
      } catch (err) {
        console.error(err);
        const message = 'Η αποθήκευση του προϊόντος απέτυχε.';
        this.$swal({
          type: 'error',
          text: message
        });
      } finally {
        this.busy = false;
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
</style>
