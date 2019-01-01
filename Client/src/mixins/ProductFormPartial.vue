<script>
export default {
  data() {
    return {
      product: {}
    };
  },
  mounted() {
    this.$emit('change', this.product);
  },
  watch: {
    product: {
      deep: true,
      handler() {
        this.$emit('change', this.product);
      }
    }
  }
};
</script>
