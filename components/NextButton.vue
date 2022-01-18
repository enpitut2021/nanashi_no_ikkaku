<template>
    <p class="under-button-item">
        <b-button size="is-large"
        @click="trigger"
        style="border:none"
        >
        <div class="disp-flex">
        <h1>{{ message }}</h1>
          <b-icon
                icon="arrow-right-circle"
                size="is-large">
            </b-icon>
            </div>
        </b-button>
      </p>
</template>

<style lang="scss" scoped>
.under-button-item {
  float: left;
  padding-right: 10px;
}
.disp-flex {
  display: flex;
  flex-direction: row;
}
</style>

<script>
export default {
  props: ['message'],
 methods: {
     trigger () {
         this.$emit('click');
     }
 }
}
</script>