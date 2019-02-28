<template>
  <v-data-table
    :headers="headers"
    :items="shops"
    class="elevation-1"
  >
    <template
      slot="items"
      slot-scope="props"
    >
      <td
        @click="view(props.item.id);"
      >{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.phoneNumber }}</td>
      <td class="text-xs-right">{{ props.item.long }}</td>
      <td class="text-xs-right">{{ props.item.lat }}</td>
      <td class="text-xs-right">{{ props.item.address }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    shops: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Όνομα',
          align: 'left',
          value: 'name'
        },
        { text: 'Αριθμός Τηλεφώνου', value: 'phoneNumber', sortable: false },
        { text: 'Long', value: 'fat', sortable: false },
        { text: 'Lat', value: 'fat', sortable: false },
        { text: 'Διεύθυνση', value: 'address' }
      ]
    };
  },
  methods: {
    view(id) {
      this.$router.push({
        name: 'shop',
        params: {
          id
        }
      });
    }
  }
};
</script>

