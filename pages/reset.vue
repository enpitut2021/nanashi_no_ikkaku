<template>
<div>
    <b-button @click="reset()" class="m-3">Firebaseリセット</b-button>
    <p>{{this.show1}}</p>
     <p>{{this.show2}}</p>
</div>
</template>
<script>
import firebase from "@/plugins/firebase";
export default {
    data() {
        return  {
            show1: [],
            show2: [],
        };
    },

    mounted(){
         const obj = [];
         const obj2 = [];
         const db = firebase.firestore();
         let dbMembers = db.collection("members");
         let dbWords = db.collection("test");

            dbMembers.onSnapshot(function(snapshot) {
                obj2.splice(0);
                snapshot.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    obj2.push(data.id);
                });
            });

            dbWords.onSnapshot(
                function(snapshot) {
                    obj.splice(0);
                 snapshot.forEach(doc => {
                      const data = doc.data();
                      data.id = doc.id;
                      obj.push(data.id);
                });     
             }
            );
            this.show1 = obj
            this.show2 = obj2

    },

    methods: {
        reset(){
            const db = firebase.firestore();
            let dbWadai = db.collection("wadai");
            let dbMembers = db.collection("members");
            let dbWords = db.collection("test");


            this.show2.forEach(member => { 
                console.log(member);
                dbMembers.doc(member).delete();
            });

            this.show1.forEach(word => {
                console.log("bbbb")
                console.log(word);
                dbWords.doc(word).delete()
            });

            dbWadai.doc("buttonStatus").update({
                memberStatus: {}
            })

            dbWadai.doc("wadaiIndex").update({
                index: -1
            })
        }
    }
}
</script>