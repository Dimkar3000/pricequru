<template>
  <span>
    {{ query }}
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
