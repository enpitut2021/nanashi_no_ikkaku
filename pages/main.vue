<template>
  <div>
    <div>
      <input type="text" v-model="field" placeholder="ワード" />
      <button @click="submit">追加</button>
      <h2 v-show="time">{{ this.odai[index] }}</h2>
    </div>
    <div>
      <button @click="showName = true">終了</button>
      <h2 v-show="showName">
        おすすめのチーム名：
        {{ this.words.length != 0 ? this.words[0].word : "" }}
      </h2>
	  <h2 v-show="shoukai">自己紹介をしてみよう</h2>
    </div>
    <div v-for="row in arrangedWords" :key="row.id" style="margin: 20px">
      <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
        <button @click="good(item.id)" v-for="item in row" :key="item.id" class="moji" style="background-color: rgba(0,0,0,0.2); border-radius: 30px; border: 0; box-shadow: 5px 5px 5px gray; transition: .3s;">
          <div v-bind:style="{ fontSize: 1 + Math.log(1 + item.good) + 'vh' }">
            {{ item.word }}👍
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
button:hover{
	box-shadow: none;
	transform: translate3d(0, 5px, 0);
} 
</style>


<script>
import firebase from "@/plugins/firebase";
export default {
  data() {
    return {
      words: [],
      arrangedWords: "hi",
      time: false,
      timerId: undefined,
      field: "",
      odai: [
        "出身が一番北の人は誰ですか？",
        "来世は何の生き物になりたいですか？",
        "味噌汁に入ってると嬉しいものはなんですか？",
        "最近あった7番目に嬉しいことは何ですか？",
        "「私実は〇〇なんです」",
        "好きなポケモンはなんですか？",
        "自分を一つの漢字で表してみましょう"
      ],
      index: -1,
      showName: false,
      shoukai: true
    };
  },

  mounted() {
    const obj = [];
      const db = firebase.firestore();
      db.collection("odai").doc("odai").onSnapshot((snapshot) => {
	  console.log(snapshot.data()["odaiIndex"]);
	  this.index = snapshot.data()["odaiIndex"];
	  });
    db.collection("test").onSnapshot(
      function(snapshot) {
        obj.splice(0);
        snapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          obj.push(data);
          // console.log(obj)
        });

        // 表示用にワードを菱形に変形（二次元配列）
        this.arrangedWords = this.arrangeWords(obj);

        // ワードの配列の更新の度にソートする。いいね数が大きいのが先に来るのに注意
        // アロー関数（arrow function）と三項演算子(ternary operator）を使ってる。
        obj.sort((a, b) => (a.good > b.good ? -1 : a.good < b.good ? 1 : 0));

        // お題表示タイマーのリセット
        this.time = false; //一旦表示を消す
        clearTimeout(this.timerId);
        //　新しくタイマーの設定
        this.timerId = setTimeout(
          function() {
            this.time = true;
            this.shoukai = false;
          }.bind(this),
          30000
        );
      }.bind(this)
    );

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
            good: 0
          })
          .then(ref => {
            console.log("Add ID: ", ref.id);
          });
        this.field = "";
      }
	// firebase上でお題のindexを１増やす
	db.collection("odai").doc("odai").set({
	    odaiIndex: this.index + 1
	    });
    },

    // showOdai() {
    //   time = true;
    //   console.log("お題が出る")
    // },

    good(id) {
      const db = firebase.firestore();
      let dbWord = db.collection("test").doc(id);
      dbWord.get().then(function(doc) {
        if (doc.exists) {
          console.log(dbWord);
          let newGood = doc.data().good + 1;
          dbWord
            .update({
              good: newGood
            })
            .then(ref => {
              console.log("Good can't be updated.");
            });
        }
      });
    },

    arrangeWords(words) {
      // 並び替えられたワードの配列。
      // index=0からから一行ずつそれぞれ表示（手動改行してる）
      let arrangedWords = [[]];
      // 次にワードを追加する行が何行目か
      let nextAddRow = 0;
      // 菱形の半径
      let shapeSize = 1;
      words.forEach((el, i) => {
        if (i % 2 == 0) arrangedWords[nextAddRow].unshift(el);
        // i行目の左端に追加
        else {
          arrangedWords[nextAddRow++].push(el); // i行目の右端に追加
          //　i番目のワードがshapeSizeが変わる前最後のワードであれば
          if (i + 1 == 2 * (shapeSize * shapeSize)) {
            nextAddRow = 0;
            shapeSize++;
            // 新しく菱形の上と下に行を追加
            arrangedWords.unshift([]);
            arrangedWords.push([]);
          }
        }
      });
      console.log("words arranged!");
      console.log(arrangedWords);
      return arrangedWords;
    }
  }
};
</script>
