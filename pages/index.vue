<template>
<div>
  <input type="text" v-model="words.word" id="field" placeholder="ワード">
  <button @click = "submit">追加</button>
  <button @click = "reload">更新</button>
  <ul id="example-1">
  <li v-for="item in words" :key="item.id">
    {{ item.word }}
    <button >👍</button>
  </li>
</ul>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase"
export default {
  async asyncData({ params }) {
    return {
      words: await getAllDocs("words")
    };
  },

 methods: {
   submit () {
     const db = firebase.firestore()
     let dbWords = db.collection('words')
     let inputWord = this.words.word
     if (inputWord != ""){
      dbWords
       .add({
         word: inputWord
       })
       .then(ref => {
         console.log('Add ID: ', ref.id)
       })
      var textField = document.getElementById("field");
      textField.value = '';
     }
   },

   async reload (){
     this.words = await getAllDocs("words")
   },

  },
}

async function getAllDocs(collection) {
    let obj = [];
    const db = firebase.firestore()
    let colRef = db.collection(collection);
    const allSnapShot = await colRef.get();
    allSnapShot.forEach(doc => {
      obj.push(doc.data());
    });
    return obj;
}
  
</script>