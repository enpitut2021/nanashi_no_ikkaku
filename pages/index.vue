<template>
  <div>
    <h1>パッと思いつく単語をいれよう</h1>
    <input type="text" />
    <nuxt-link to="/main">
      <button @click="submit">追加</button>
    </nuxt-link>
  </div>
</template>
<script>
import firebase from "@/plugins/firebase";
export default {
  data() {
    return {
      words: {},
    };
  },
  methods: {
    submit() {
      const db = firebase.firestore();
      let dbWords = db.collection("test");
      let inputWord = this.field;
      if (inputWord != "") {
        dbWords
          .add({
            word: inputWord,
            good: 0,
          })
          .then((ref) => {
            console.log("Add ID: ", ref.id);
          });
         this.field = ''
      }
    },
  },
}
</script>

