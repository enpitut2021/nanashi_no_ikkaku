<template>
  <div class="origin">
    <div class="columns is-fullheight">
      <Sidebar :members="members" />
      <div class="container column is-10">
        <div class="columns is-centered">
          <div class="column mt-5">
            <h1 class="title is-1 has-text-centered">
          {{ (this.wadais) ? this.wadais[this.wadaiIndex] : "" }}
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
          <NextButton @click="buttonPush" 
          v-bind:message="buttonMessage" />
        </div>
          <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
            <div class="card pb-6">
              <div class="card-image">
                <figure class="image is-100x100">
                  <img
                    src="~assets/images/ナナシロゴ_背景透過.png"
                    alt="Image"
                  />
                </figure>
              </div>
              <div class="content">
                <p class="title is-4 has-text-centered">
                  おすすめのチーム名：
                  {{ this.words.length != 0 ? this.words[0].word : "" }}
                </p>
              </div>
            </div>
          </b-modal>
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
      showName: false,
      shoukai: true,
      space: true,
      isCardModalActive: false,
      wadaiIndex: 0,
      wadais: [],
      showUpvote: false,
      phase: 1, // 0は始まる前、１はお題に答えている途中、2はリアクションタイム
      memberStatus: {}, //今のフェーズでボタンを誰が押したか
      username: ""
    };
  },

  computed: {
    buttonMessage() {
      return (this.wadaiIndex + 1 == this.wadais.length) ? 'おすすめのチーム名を見る': '次のお題に進む';
    }
  },

  mounted() {

    this.username = this.$route.params.member

    // リンクで仕様指定（例：localhost:3000/main?showUpvote=true）
    this.showUpvote = this.$route.query.showUpvote === "true";
    const obj = [];
    const obj2 = [];
    const db = firebase.firestore();
    let wadaiRef = db.collection("wadai");
    wadaiRef
      .doc("wadaiList")
      .onSnapshot(snapshot => {
        this.wadais = snapshot.data()["wadais"];
      });
    wadaiRef
      .doc("wadaiIndex")
      .onSnapshot(snapshot => {
        this.wadaiIndex = snapshot.data()["index"];
      });
    wadaiRef
      .doc("buttonStatus")
      .onSnapshot(snapshot => {
        this.memberStatus = snapshot.data()["memberStatus"]
        // dtools.log("誰かががボタンを押した");
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
        }
      });
    },

    buttonPush() {
      //すでに今の話題に対して次にすすむボタンを押していたらreturn
      if (this.memberStatus[this.username])
        return
      const db = firebase.firestore();
      let dbButtonStatus = db.collection("wadai").doc("buttonStatus");
      dbButtonStatus.get().then((doc) => {
        if (doc.exists) {
          let newMemberStatus = doc.data().memberStatus;
          newMemberStatus[this.username] = true;
          for (const [key, value] of Object.entries(newMemberStatus)) {
            //押してない人がいたら
            if (!value) {
              //更新したmemberStatusをfirebaseに送信
              const db = firebase.firestore();
              let dbButtonStatus = db.collection("wadai").doc("buttonStatus");
              dbButtonStatus.get().then((doc) => {
                if (doc.exists) {
                  dbButtonStatus.update({
                    memberStatus: newMemberStatus
                  }).then(() => {
                    dtools.log("押した人更新");
                  });
                }
              });
              return;
            }
          }

          // 全員が押していたら次の処理に進む
          this.phase = 0; 
          //　ボタン押した人数をリセット
          Object.keys(this.memberStatus).forEach(i => this.memberStatus[i] = false)
          const db = firebase.firestore();
          let dbButtonStatus = db.collection("wadai").doc("buttonStatus");
          dbButtonStatus.get().then((doc) => {
            if (doc.exists) {
              dbButtonStatus.update({
                memberStatus: this.memberStatus
              }).then(() => {
                dtools.log("押した人リセット");
              });
            }
          });
          //お題が全て終わったら名前を表示する
          if (this.wadaiIndex + 1 == this.wadais.length) {
            this.isCardModalActive = true
          }
          //お題を１つ進める
          let dbWadaiIndex = db.collection("wadai").doc("wadaiIndex");
          dbWadaiIndex.get().then((doc) => {
            dtools.log(doc.data().index)
            if (doc.exists) {
              dbWadaiIndex.update({
                index: doc.data().index + 1
              }).then(() => {
                dtools.log("お題を進めた");
              });
            }
          });
          dtools.log("みんなボタン押したよ")
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
