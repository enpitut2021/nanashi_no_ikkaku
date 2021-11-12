<template>
  <div>
    <input type="text" v-model="words.word" id="field" placeholder="ワード" />
    <button @click="submit">追加</button>
    <button @click="reload">更新</button>
    <ul id="example-1">
      <li v-for="item in words" :key="item.id">
      <div v-bind:style="{ fontSize: item.good + 'rem' }">
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
  async asyncData({ params }) {
    return {
      words: await getAllDocs("word"),
    };
  },

  methods: {
    submit() {
      const db = firebase.firestore();
      let dbWords = db.collection("word");
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
      let dbWord = db.collection("word").doc(id);
      dbWord.get().then(function (doc) {
        if (doc.exists) {
          console.log(dbWord);
          let newGood = doc.data().good + 1;

          dbWord
            .update({
              good: newGood,
            })
            .then((ref) => {
              console.log("Add ID: ", ref.id);
            });
        }
      });
    },

    async reload() {
      this.words = await getAllDocs("word");
    },
  },
};

async function getAllDocs(collection) {
  let obj = [];
  const db = firebase.firestore();
  let colRef = db.collection(collection);
  const allSnapShot = await colRef.get();
  allSnapShot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    obj.push(data);
  });
  return obj;
}
</script>
