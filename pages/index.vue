<template>
<div>
  <input v-model="message" placeholder="ワード">
  <button >追加</button>
  <ul id="example-1">
  <li v-for="(item, index) in words" :key="item">
    {{ item }}
    <button v-on:click="$set(goodCount, index, goodCount[index]+1)">👍{{goodCount[index]}} </button>
  </li>
</ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        words: ['yuku', 'azami', 'pi-men'],
        goodCount: [0, 0, 0],
	countReload: 0,
      }
    },
    async fetch() {

    }
  }
</script>
