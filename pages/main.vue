<template>
  <div class="origin">
	<section class="section">
    <div class="columns is-centered">
      <div class="column is-half">
        <h1 class="title is-1 has-text-centered">
          {{ (this.wadais) ? this.wadais[this.wadaiIndex] : "" }}
        </h1>
		<div class="card p-5 is-rounded">
        <p>
			<b-field label="話題">
            	<b-input v-model="wadai"></b-input>
        	</b-field>
          <b-button
            @click="
              changeWadai(wadai);
              wadai = '';
            "
          >
            変更
          </b-button>
        </p>
		</div>
      </div>
    </div>
	</section>
    <div class="suggest-name">
      <p v-show="showName" class="under-button-item">
        おすすめのチーム名：
        {{ this.words.length != 0 ? this.words[0].word : "" }}
      </p>
      <NextButton @click="buttonPush"/>
    </div>
    <div v-for="row in arrangedWords" :key="row.id" class="word-margin columns">
      <div class="word-align column is-full">
        <b-button
		  type="is-primary" outlined
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
	<div class="bottom-input columns is-centered">
        <div class="column is-half card p-5">
          <p>
			<b-field label="ワード">
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
	<div>
	<p>いま話してるメンバー</p>
      <p v-for="member in members" :key="member.id">{{ member.member }}</p>
    </div>
  </div>
</template>

<style lang="css" scoped>
h2 {
  margin: 0;
}

.origin {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.bottom-input {
  position: fixed;
  width: 100%;
  bottom: 20px;
  left: 20px;
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

.card{
	background-color: rose;
}
</style>
<script>
import firebase from "@/plugins/firebase";
import dtools from "@/plugins/debug-tools.js";
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
      showButton: true,
      shoukai: true,
      space: true,
      wadaiIndex: 0,
      wadais: [],
      showUpvote: false,
      phase: 1, // 0は始まる前、１はお題に答えている途中、2はリアクションタイム
      buttonCount: 0, //今のフェーズでボタンを何人押したか
    };
  },

  mounted() {
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
        this.buttonCount = snapshot.data()["buttonCount"]
        this.next(this.buttonCount)
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
        }
      });
    },

    buttonPush() {
      const db = firebase.firestore();
      let dbButtonStatus = db.collection("wadai").doc("buttonStatus");
      dbButtonStatus.get().then((doc) => {
        if (doc.exists) {
          let newButtonCount = doc.data().buttonCount + 1;
          dbButtonStatus.update({
            buttonCount: newButtonCount
          }).then(() => {
            // dtools.log("自分がボタンを押した");
          });
        }
      });
    },

    next(pushCount) {
      // 次に進むボタンが押された時動く（自分以外が押した時も）
      dtools.log("ボタン押した人は"+pushCount+"人（"+this.members.length+"人中）")
      dtools.log("今のフェーズは:"+this.phase)
      if (this.phase == 1 
          && this.members.length != 0
          && pushCount >= this.members.length) {
        this.phase = 0;
        // ここにお題を次のに進めるロジックを書く
        dtools.log("みんなボタン押したよ")
      }
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
