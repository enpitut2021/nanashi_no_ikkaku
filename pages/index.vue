<template>
  <div>
    <div class="text">
      <label>最近のマイブームは</label>
      <input
        style="font-size: 30px"
        type="text"
        v-model="inputs[1]"
        size="10"
        placeholder="瞑想"
      />
      <label>です！</label>
      <label>なまえは</label>
      <input
        style="font-size: 30px"
        type="text"
        v-model="regist[1]"
        size="10"
        placeholder="花子"
      />
      <label>です！</label>
    </div>
    <nuxt-link to="/main">
      <button @click="submit">こんにちは</button>
    </nuxt-link>
  </div>
</template>
<style scoped>
div {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text {
  max-width: 50%;
  text-align: center;
  font-size: 30px;
  margin: 30px;
}
</style>
<script>
import firebase from "@/plugins/firebase";
import dtools from "@/plugins/debug-tools.js";
export default {
  data() {
    return {
      inputs: [],
      regist: []
    };
  },
  methods: {
    submit() {
      const db = firebase.firestore();
      let dbWords = db.collection("test");
      let dbregist = db.collection("members");
      this.inputs.forEach(word => {
        let inputWord = word;
        if (inputWord != "") {
          dbWords
            .add({
              word: inputWord,
              good: 0
            })
            .then(ref => {
              dtools.log("Add ID: ", ref.id);
            });
        }
      });
      this.regist.forEach(member=> {
        let inputmember = member;
        if(inputmember  !=  ""){
          dbregist.add({
            member: inputmember
          })
          .then(ref =>{
            dtools.log("ADD MEMBER: ", ref.member)
          })
        }
      })
    }
  }
};
</script>
