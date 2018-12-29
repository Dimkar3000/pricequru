<template>
  <h2>Κατάστημα {{ id }}</h2>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: String,
    }
  }
};
</script>
