<template>
  <div class="origin">
    <div class="columns is-fullheight">
      <Sidebar :members="members" />
      <div class="container column is-10">
        <div class="columns is-centered">
          <div class="column mt-5">
            <h1 class="title is-1 has-text-centered">
              {{ this.currentWadai }}
            </h1>
            <div class="columns is-centered">
              <div class="column is-half card p-3">
                <p>
                  <b-field label="アンサー">
                    <b-input v-model="field"></b-input>
                  </b-field>
                  <b-button
                    @click="
                      submit(field);
                      field = '';
                    "
                  >
                    追加
                  </b-button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="row in arrangedWords"
          :key="row.id"
          class="word-margin columns"
        >
          <div class="word-align column is-full">
            <b-button
              type="is-primary"
              outlined
              @click="good(item.id)"
              v-for="item in row"
              :key="item.id"
              class="moji"
              v-bind:style="{ fontSize: 1 + Math.log(1 + item.good) + 'vh' }"
            >
              {{ item.word + (showUpvote ? "👍" : "") }}
            </b-button>
          </div>
        </div>
        <div class="suggest-name">
          <p v-show="showName" class="under-button-item">
            おすすめのチーム名：
            {{ this.words.length != 0 ? this.words[0].word : "" }}
          </p>
          <p class="under-button-item">
            <b-button
              size="is-large"
              v-show="showButton"
              @click="
                showName = true;
                showButton = false;
              "
            >
              <b-icon icon="arrow-right-circle" size="is-large"> </b-icon>
            </b-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin: 0;
}
.origin {
  margin-bottom: 1rem;
}

.word-margin {
  margin-bottom: 30px;
}

.word-align {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.suggest-name {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.align-center {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.under-button-item {
  float: left;
  padding-right: 10px;
}
.moji {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  border: 0;
  box-shadow: 5px 5px 5px gray;
  transition: 0.3s;
}

.moji:hover {
  position: relative;
  transform: translate3d(0, 5px, 0);
}

.card {
  background-color: rose;
}
</style>
<script>
import firebase from "@/plugins/firebase";
import dtools from "@/plugins/debug-tools.js";
import Sidebar from "../components/Sidebar.vue";
export default {
  data() {
    return {
      words: [],
      arrangedWords: "hi",
      members: [],
      time: false,
      timerId: undefined,
      field: "",
      odaiAns: "",
      odai: [
        // "出身が一番北の人は誰ですか？",
        // "来世は何の生き物になりたいですか？",
        // "味噌汁に入ってると嬉しいものはなんですか？",
        // "最近あった7番目に嬉しいことは何ですか？",
        // "「私実は〇〇なんです」",
        // "好きなポケモンはなんですか？",
        // "自分を一つの漢字で表してみましょう"
        "タメ口で話そう!!!"
        // "自分の名前から話し始めてみようex.「〇〇は、ツーリングが趣味です」",
        // "テンションを高くしろ！！！",
        // "いちばん名前の文字数が長い人が武士になる(同率はありやで)",
        // "自分を一つの漢字で表してみましょう",
      ],
      index: -1,
      showName: false,
      showButton: true,
      shoukai: true,
      space: true,
      currentWadai: "",
      showUpvote: false
    };
  },

  mounted() {
    // リンクで仕様指定（例：localhost:3000/main?showUpvote=true）
    this.showUpvote = this.$route.query.showUpvote === "true";
    const obj = [];
    const obj2 = [];
    const db = firebase.firestore();
    db.collection("odai")
      .doc("odai")
      .onSnapshot(snapshot => {
        dtools.log(snapshot.data()["odaiIndex"]);
        this.index = snapshot.data()["odaiIndex"];
      });
    db.collection("wadai")
      .doc("userWadai")
      .onSnapshot(snapshot => {
        this.currentWadai = snapshot.data()["wadai"];
      });
    db.collection("members").onSnapshot(function(snapshot) {
      obj2.splice(0);
      snapshot.forEach(doc => {
        const data = doc.data();
        data.id = doc.id;
        obj2.push(data);
      });
    });
    db.collection("test").onSnapshot(
      function(snapshot) {
        obj.splice(0);
        snapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          obj.push(data);
          // dtools.log(obj)
        });
        // 表示用にワードを菱形に変形（二次元配列）
        this.arrangedWords = this.arrangeWords(obj);
        // ワードの配列の更新の度にソートする。いいね数が大きいのが先に来るのに注意
        // アロー関数（arrow function）と三項演算子(ternary operator）を使ってる。
        obj.sort((a, b) => (a.good > b.good ? -1 : a.good < b.good ? 1 : 0));
      }.bind(this)
    );
    this.timerId = setTimeout(
      function() {
        this.time = true;
        this.space = false;
      }.bind(this),
      120000
    );

    dtools.log(this.time);
    this.words = obj;
    this.members = obj2;
  },
  components: {
    Sidebar
  },
  methods: {
    submit(field) {
      let kizon = false;
      this.words.forEach(element => {
        if (element.word == field) {
          dtools.log("すでにあるワードだよ");
          kizon = true;
        }
      });
      if (kizon) return;
      const db = firebase.firestore();
      let dbWords = db.collection("test");
      let inputWord = field;
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
    },

    changeWadai(wadai) {
      const db = firebase.firestore();
      let dbWadai = db.collection("wadai").doc("userWadai");
      let inputWadai = wadai;
      if (inputWadai != "") {
        dbWadai
          .update({
            wadai: inputWadai
          })
          .then(ref => {
            dtools.log("Add ID: ", ref.id);
          });
      }
    },

    answer() {
      // お題表示タイマーのリセット
      this.time = false; //一旦表示を消す
      clearTimeout(this.timerId);
      // 新しくタイマーの設定
      this.timerId = setTimeout(
        function() {
          this.time = true;
        }.bind(this),
        dtools.ODAI_WAIT_TIME
      );

      // firebase上でお題のindexを１増やす
      const db = firebase.firestore();
      db.collection("odai")
        .doc("odai")
        .set({
          odaiIndex: this.index + 1
        });
    },
    good(id) {
      const db = firebase.firestore();
      let dbWord = db.collection("test").doc(id);
      dbWord.get().then(function(doc) {
        if (doc.exists) {
          dtools.log(dbWord);
          let newGood = doc.data().good + 1;
          dbWord
            .update({
              good: newGood
            })
            .then(() => {
              dtools.log("Good can't be updated.");
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
          // i番目のワードがshapeSizeが変わる前最後のワードであれば
          if (i + 1 == 2 * (shapeSize * shapeSize)) {
            nextAddRow = 0;
            shapeSize++;
            // 新しく菱形の上と下に行を追加
            arrangedWords.unshift([]);
            arrangedWords.push([]);
          }
        }
      });
      dtools.log("words arranged!");
      dtools.log(arrangedWords);
      return arrangedWords;
    }
  }
};
</script>
