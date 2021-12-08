<template>
  <div>
    <div>
      <input type="text" v-model="field"  placeholder="ワード" />
      <button @click="submit">追加</button>
      <h2 v-show="time">いちばん北の人はだれですか?? </h2>
    </div>
    <div style="display: flex; flex-wrap: wrap">
    <div v-for="item in words" :key="item.id" style="background-color: red">
      <div v-bind:style="{ fontSize: 1 + Math.log(1 + item.good) + 'rem' }">
        {{ item.word }}
      </div>
      <button @click="good(item.id)">👍{{ item.good }}</button>
    </div>
    </div>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";
export default {
    data() {
	return {
	    words: {},
	    time: false,
	    timerId: undefined,
	    field: "",
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
		// アロー関数（arrow function）と三項演算子(ternary operator）を使ってる。
    		obj.sort((a, b) =>
		    (a.good > b.good) ? -1 : ((a.good < b.good) ? 1 : 0));
    		// console.log(obj);
		// お題表示タイマーのリセット
		this.time = false; //一旦表示を消す
		clearTimeout(this.timerId);
		//　新しくタイマーの設定
		this.timerId = setTimeout(function(){
		    this.time = true;
		}.bind(this), 3000);
            }.bind(this));
	this.timerId = setTimeout(function(){
	    this.time = true;
	}.bind(this), 3000);
	console.log(this.time);
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

    // showOdai() {
    //   time = true;
    //   console.log("お題が出る")
    // },

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
