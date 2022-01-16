<template>
  <div
    style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center"
  >
    <div
      style="max-width: 50%; text-align: center; font-size: 30px; margin: 30px"
    >
    <!-- <div> 
      <label>最近のマイブームは</label>
      <input
        style="font-size: 30px"
        type="text"
        v-model="inputs[1]"
        size="10"
        placeholder="瞑想"
      />
      <label>です！</label>
    </div> -->
<section class="hero">
  <div class="hero-body">
    <div>
      <img src="~assets/images/ナナシロゴ_背景透過.png" alt="">
    </div>
    <p class="subtitle">
      ナナシはオンラインで使う、初対面のチーム向けのアイスブレイクアプリです。
    </p>
  </div>
</section>
      <div>
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
    </div>
    <nuxt-link to="/main">
      <b-button @click="submit">こんにちは</b-button>
    </nuxt-link>
  </div>
</template>
<style lang="scss">
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
