<template>
  <div
    style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center"
  >
    <div
      style="max-width: 50%; text-align: center; font-size: 30px; margin: 10px"
    >
<section class="hero">
  <div class="hero-body">
    <div>
      <img src="~assets/images/ナナシロゴ_背景透過.png" alt="">
    </div>
    <p class="subtitle">
      ナナシはオンラインで使う、初対面のチーム向けのアイスブレイクアプリです。<br>お題に答える、話し合う、ワードを押してリアクションをすることで仲良くなれるし、いつの間にかチーム名が決まっています!?
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
    <nuxt-link :to="{name: 'main', params: { member: regist[1]}}">
      <b-button @click="submit(regist[1])" class="mb-5">アイスブレイクを始める</b-button>
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
      regist: [],
      members: []
    };
  },

  mounted(){
    const obj = [];
    const db = firebase.firestore();
    db.collection("members").onSnapshot(function(snapshot) {
      obj.splice(0);
      snapshot.forEach(doc => {
        const data = doc.data();
        data.id = doc.id;
        obj.push(data);
      });
      console.log(obj)
    });
    this.members = obj
  },

  methods: {
    submit(field) {
      const db = firebase.firestore();
      let dbWords = db.collection("test");
      let dbregist = db.collection("members");
      let dbButtonStatus = db.collection("wadai").doc("buttonStatus");
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

      
      let kizon = false;
      this.members.forEach(member => {
        if (member.member == field) {
          dtools.log("すでに入っている人だよ");
          console.log("きぞん")
          kizon = true;
        }
      });
      if (kizon) return;

      this.regist.forEach(member=> {
        let inputmember = member;
        if(inputmember  !=  "" ){
          dbregist.add({
            member: inputmember
          })
          .then(ref =>{
            dtools.log("ADD MEMBER: ", ref.member)
          })
          dbButtonStatus.get().then((doc) => {
              dtools.log("新しくbuttonStatus")
            if (doc.exists) {
              let newMemberStatus = Object.assign(doc.data().memberStatus, {[inputmember]: false})
              dtools.log("新しくbuttonStatus")
              dtools.log(newMemberStatus)
              dbButtonStatus.update({
                memberStatus: newMemberStatus
              });
            }
          });
        }
      })
    }
  }
};
</script>
