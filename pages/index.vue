<template>
<div>
  <input type="text" v-model="message" placeholder="ワード">
  <button >追加</button>
  <button @click = "getData">更新</button>
  <ul id="example-1">
  <li v-for="item in words" :key="item">
    {{ item }}
    <button >👍</button>
  </li>
</ul>
  <div id="user.name" />
  </div>
</template>

<script>
import firebase from "@/plugins/firebase"
  export default {
 data () {
   return {
    words: ['yuku', 'azami', 'pi-men']
   }
   
 },
 methods: {
   submit () {
     const db = firebase.firestore()
     let dbUsers = db.collection('users')
     dbUsers
       .add({
         name: this.user.name,
         email: this.user.email,
       })
       .then(ref => {
         console.log('Add ID: ', ref.id)
       })
   },
   getData()  {
     const db = firebase.firestore()
     let dbUsers = db.collection('users').doc('cgm9KDnMSqQIGnmumN62')
    dbUsers.get().then(function(doc){
      document.getElementById("user.name").innerHTML = (doc.data().name)
    })
   },
 },
}
  
</script>
