<template>
  <span>
    Αναζητήσατε τον όρο "{{ query }}"
  </span>
</template>

<script>
export default {
  props: {
    query: {
      default: '',
      type: String
    }
  }
};
</script>
