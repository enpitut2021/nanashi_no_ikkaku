<template>
<div>
  <input v-model="message" placeholder="ワード">
  <button >追加</button>
  <ul id="example-1">
  <li v-for="item in words" :key="item">
    {{ item }}
    <button >👍</button>
  </li>
</ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        words: ['yuku', 'azami', 'pi-men']
      }
    },
    async fetch() {

    }
  }
</script>
