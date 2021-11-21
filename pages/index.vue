<template>
  <div style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <div style="max-width: 50%; text-align: center; font-size: 30px; margin: 30px">
      <label>私は</label>
      <input style="font-size: 30px" type="text" v-model="inputs[0]" placeholder="ニックネーム" />
      <label>です。</label>
      <br>
      <label>最近のマイブームは</label>
      <input style="font-size: 30px" type="text" v-model="inputs[1]" placeholder="読書" />
      <label>です。</label>
      <br>
      <label>好きなお菓子は</label>
      <input style="font-size: 30px" type="text" v-model="inputs[2]" placeholder="マシュマロ" />
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

