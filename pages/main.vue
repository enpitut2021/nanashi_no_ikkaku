<template>
  <div class="origin">
    <div class="columns is-fullheight">
      <Sidebar :members="members"/>
      <div v-show="before" class="startbutton has-text-centered is-centered">
        <p class="title mb-2">みんなが揃ったらゲームを始めよう！</p>
        <b-button size="is-medium" @click="startGame()">ゲームを始める</b-button>
      </div>
      <div v-show="game" class="container column is-10">
        <div
          v-for="row in arrangedWords"
          :key="row.id"
          class="word-margin columns is-vcentered is-centered"
        >
          <div class="word-align column is-full">
            <b-button
              type="is-primary"
              outlined
              @click="good(item.id)"
              v-for="item in row"
              :key="item.id"
              class="moji"
              v-bind:style="{ fontSize: 1.75 + Math.log(1 + item.good) + 'vh' }"
            >
              {{ item.word + (showUpvote ? "👍" : "") }}
            </b-button>
          </div>
        </div> 

        <div v-show="slideCard" class="odai-input">
          <b-button size="is-large" @click="showCard = true; slideCard = false;">
            <!-- <b-icon pack="fa" icon="angle-left" size="is-large"/> //なんかアイコンにできなかった　--> 
           <p size="is-large"> {{ (this.finish) ? "出す" : 
                                  ((this.timerlessArray.includes(this.wadaiIndex)) ? "話し合おう": "あと"+this.timerSec+"秒")  }} </p>
          </b-button>
        </div>
        
        <div v-show="showCard" class="odai-input">
            <div class="card p-4">
              <header class="card-header">
                <p class="card-header-title">
                  {{ (this.finish) ? "おすすめのチーム名をチェック！" : 
                     ((this.timerlessArray.includes(this.wadaiIndex)) ? "話し合おう": "あと"+this.timerSec+"秒")  }}
                </p>
                <p class="push-the-button">
                     {{ (this.finish) ? "" : "終わったら次に進もう!"}}
                </p>
              </header>
              <div class="card-content">
                <p class="title has-text-centered">
                 {{ (this.wadais) ? this.wadais[this.wadaiIndex] : "" }}
                </p>
              </div>
              
              <p class="content columns is-vcentered is-centered">
                <span class="column is-9">
                 <b-field>
                  <b-input size="is-medium" v-model="field" placeholder="答え" rounded></b-input>
                 </b-field>
                </span>
                <span class="column is-2 pl-0 has-text-centered">
                  <b-button
                    @click="
                      submit(field);
                      field = '';
                    "
                  size="is-medium"
                  rounded>
                  ＞
                  </b-button>
                </span>
              </p>
              
                
              <footer class="card-footer">
                <p class="under-button-item card-footer-item">
                    <b-button size="is-large"
                    @click="showCard = false; slideCard = true"
                    style="border:none"
                    >
                      <div class="disp-flex">
                        <h1>隠す</h1>   
                      </div>
                    </b-button>
                </p>
                <NextButton @click="buttonPush();" 
                  v-bind:message="buttonMessage" v-bind:memberStatus="memberStatus"
                  class="card-footer-item"/>
                </footer>
            </div>
          </div>
          <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
            <div class="card pb-6">
              <div class="card-image">
                <figure class="image is-100x100">
                  <img
                    src="~assets/images/ナナシcompleted.gif"
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
</template>

<style lang="scss" scoped>



*{
margin-top: 0;
margin-bottom: 0;
}

h2 {
  margin: 0;
}

.origin {
  margin-bottom: 1rem;
  width:100%!important;
  height:100%!important;
  position: fixed;
}

.startbutton{
  margin:auto;
}

.push-the-button{
  align-items: center;
  color: #363636;
  display: flex;
  font-weight: 700;
  padding: 0.75rem 1rem;
}

.is-fullheight{
  height:100%!important;
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

.odai-input {
  position: fixed;
  right:20px;
  bottom: 20px;
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
  transition: 0.3s;
  border: 1px solid transparent;
  box-shadow: 5px 5px 5px rgba(0,0,0,0.3);
}

.moji:hover {
  position: relative;
  transform: translate3d(0, 5px, 0);
  box-shadow:none !important;
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
      wadaiFlag: undefined,
      field: "",
      showCard: true,
      slideCard: false,
      shoukai: true,
      space: true,
      isCardModalActive: false,
      wadaiIndex: 0,
      wadais: [],
      showUpvote: false,
      phase: 1, // 0は始まる前、１はお題に答えている途中、2はリアクションタイム
      memberStatus: {}, //今のフェーズでボタンを誰が押したか
      username: "",
      timerSec: 30,
      timerFlag: undefined,
      timerStop: undefined,
      before: true,
      game:false,
      finish:false,
      timerlessArray:[1, 3, 6]
    };
  },

  computed: {
    buttonMessage() {
      return (this.wadaiIndex + 1 == this.wadais.length) ? 'おすすめのチーム名を見る': '次のお題に進む';
    },
  },

  mounted() {

    this.username = this.$route.params.member

    if (this.game){
    clearTimeout(this.wadaiFlag);
    this.wadaiFlag = setTimeout(
      function () {
        this.nextWadai();
      }.bind(this), 30000);
    }

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
        this.resetMemberStatus();
        clearTimeout(this.wadaiFlag);

      if (!this.timerlessArray.includes(this.wadaiIndex)){
        this.wadaiFlag = setTimeout(
          function () {
            this.nextWadai();
          }.bind(this), 30000);
      }
        this.timerSet();

        if (snapshot.data()["index"] >= 0){
          this.before = false;
          this.game = true;
        }else {
          this.before = true;
          this.game = false;
        }
        
      });
    wadaiRef
      .doc("buttonStatus")
      .onSnapshot(snapshot => {
        this.memberStatus = snapshot.data()["memberStatus"]
        console.log("aaaaa")
        console.log(this.members)
        let members = this.members
        for (const member of members) {    
              let newstatus = this.memberStatus[member.member]
              db.collection("members").doc(member.id).update({
                  buttonStatus: newstatus
              })
        }
        //dtools.log("誰かががボタンを押した");
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

    startGame(){
      if (this.username != undefined){
      this.game = true
      this.before = false
      this.resetMemberStatus();
      this.nextWadai();
      }
    },

    resetMemberStatus(){
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
    },

    nextWadai(){
          const db = firebase.firestore();
          //お題を１つ進める
          let dbWadaiIndex = db.collection("wadai").doc("wadaiIndex");
          dbWadaiIndex.get().then((doc) => {
            dtools.log(doc.data().index)
            if (doc.exists && doc.data().index < this.wadais.length-1) {    
                dbWadaiIndex.update({
                   index: doc.data().index + 1,
                }).then(() => {
                   dtools.log("お題を進めた");
                });      
            // }else if (doc.data().index < 0 || doc.data().index > this.wadais.length-1){
            //     dbWadaiIndex.update({
            //        index: 0,
            //     }).then(() => {
            //        dtools.log("お題を最初からにした");
            //     }); 
            }
          });
    },

    buttonPush() {
      if (this.wadaiIndex + 1>= this.wadais.length) {
        this.isCardModalActive = true;
      }
      //すでに今の話題に対して次にすすむボタンを押していたらreturn
      if (this.memberStatus[this.username] || this.username == undefined)
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
          this.resetMemberStatus()
          this.nextWadai()
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
    },

    timerSet(){
      clearTimeout(this.timerFlag)
      this.finish = false
      console.log(this.wadaiIndex,this.wadais.length)
      if(this.wadaiIndex < this.wadais.length-1){
        this.timerSec = 30;
        this.timerFlag = setInterval(
          function() {
            this.timerSec -= 1;
          }.bind(this), 1000)
      }else if (this.wadaiIndex == this.wadais.length-1){
        this.timerSec = 30;
        this.timerFlag = setInterval(
          function() {
            this.timerSec -= 1;
            if (this.timerSec<=0){
              clearTimeout(this.timerFlag)
            }
          }.bind(this), 1000)
        this.timerStop = setTimeout(
          function() {
           this.finish = true
          }.bind(this), 30000)
      }
    },

  }
};
</script>
