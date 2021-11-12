<template>
  <div>
    <input type="text" v-model="words.word" id="field" placeholder="ワード" />
    <button @click="submit">追加</button>
    <button @click="reload">更新</button>
    <ul id="example-1">
      <li v-for="item in words" :key="item.id">
        {{ item.word }}
        <button @click="good(item.id)">👍{{ item.good }}</button>
      </li>
    </ul>
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

  mounted(){
    const obj = [];
      const db = firebase.firestore();
      db.collection("test")
        .onSnapshot(function(snapshot) {
          obj.length = 0;
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            obj.push(data)
            console.log(obj)
          });
        });
    this.words = obj;
  },

  methods: {
    submit() {
      const db = firebase.firestore();
      let dbWords = db.collection("test");
      let inputWord = this.words.word;
      if (inputWord != "") {
        dbWords
          .add({
            word: inputWord,
            good: 0,
          })
          .then((ref) => {
            console.log("Add ID: ", ref.id);
          });
        var textField = document.getElementById("field");
        textField.value = "";
      }
    },

    good(id) {
      const db = firebase.firestore();
      let dbWord = db.collection("test").doc(id);
      dbWord.get().then(function (doc) {
        if (doc.exists) {
          console.log(dbWord);
          let newGood = doc.data().good + 1;
          dbWord
            .update({
              good: newGood,
            })
            .then((ref) => {
              console.log("Good can't be updated.");
            });
        }
      });
    },
  },
};
</script>
