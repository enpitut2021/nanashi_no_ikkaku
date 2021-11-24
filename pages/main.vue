<template>
  <div>
    <div>
      <input type="text" v-model="field"  placeholder="ワード" />
      <button @click="submit">追加</button>
      <h2 v-if="time" style="position: fixed; right: 0; bottom: 0;">いちばん北の人はだれですか?? </h2>
    </div>
    <ul id="example-1">
      <li v-for="item in words" :key="item.id">
        <div v-bind:style="{ fontSize: 1 + Math.log(1 + item.good) + 'rem' }">
          {{ item.word }}
        </div>
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
      time: true,
    };
  },

  mounted(){
    const obj = [];
      const db = firebase.firestore();
      db.collection("test")
        .onSnapshot(function(snapshot) {
          obj.splice(0);
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            obj.push(data)
            // console.log(obj)
          });
	  // ワードの配列の更新の度にソートする。いいね数が大きいのが先に来るのに注意
	  // わかりずらい書き方をしてるかもなので、コードのやってることとしては同じわかりやすい書き方バージョンも書いときます
	  // まずソート時にどう要素を比較するかの関数を定義。aとbを比較したとき、
	  // どっちが大きいかを1,0,-1のどれをreturnするかで定義してる。
	  // ここではそれぞれのいいね数であるa.goodを使って比較してる。
	  // function hikaku (a, b) {
          //    if (a.good > b.good) return -1;
	  //    if (a.good < b.good) return 1;
	  //    else return 0;
          // }
	  // この関数を使ってobjを実際にソートする。
	  // obj.sort(hikaku);
	  // これをほぼ一行で端的に書くと以下のようになる。
	  // アロー関数（arrow function）と三項演算子(ternary operator）を使ってる。
    	  obj.sort((a, b) =>
               (a.good > b.good) ? -1 : ((a.good < b.good) ? 1 : 0));
    	  // console.log(obj);
        });
    this.words = obj;
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