<template>
    <p class="under-button-item">
        <b-button size="is-large"
        @click="trigger"
        >
          <b-icon
                icon="arrow-right-circle"
                size="is-large">
            </b-icon>
        </b-button>
      </p>
</template>

<style lang="scss" scoped>
.under-button-item {
  float: left;
  padding-right: 10px;
}
</style>

<script>
export default {
 methods: {
     trigger () {
         this.$emit('click');
     }
 }
}
</script>