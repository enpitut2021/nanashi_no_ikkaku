<template>
<div>
  <input type="text" v-model="words.word" placeholder="ワード">
  <button @click = "submit">追加</button>
  <!-- <button @click = "getAllDocs('words')">更新</button> -->
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
     dbWords
       .add({
         word: this.words.word
       })
       .then(ref => {
         console.log('Add ID: ', ref.id)
       })
      
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