<template>
  <div>
    <div>
      <label>私は</label>
      <input type="text" v-model="inputs[0]" placeholder="ニックネーム" />
      <label>です。最近のマイブームは</label>
      <input type="text" v-model="inputs[1]" placeholder="読書" />
      <label>です。</label>
    </div>
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
      inputs: [],
    };
  },
  methods: {
    submit() {
      const db = firebase.firestore();
      let dbWords = db.collection("test");
      this.inputs.forEach(word => {
        let inputWord = word;
        if (inputWord != "") {
          dbWords
            .add({
              word: inputWord,
              good: 0,
            })
            .then((ref) => {
              console.log("Add ID: ", ref.id);
            });
        }
      });
    },
  },
};
</script>

