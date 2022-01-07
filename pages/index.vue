<template>
  <div style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <div style="max-width: 50%; text-align: center; font-size: 30px; margin: 30px">
      <label>最近のマイブームは</label>
      <input style="font-size: 30px" type="text" v-model="inputs[1]" size="10" placeholder="瞑想" />
      <label>です！</label>
    </div>
    <nuxt-link to="/main">
      <button @click="submit">こんにちは</button>
    </nuxt-link>
  </div>
</template>
<script>
import firebase from "@/plugins/firebase"
import dtools from "@/plugins/debug-tools.js"
export default {
	data() {
		return {
			inputs: [],
		};
	},
	methods: {
		submit() {
			const db = firebase.firestore();
			let dbWords = db.collection("test");
			this.inputs.forEach(word => {
				let inputWord = word;
				if (inputWord != "") {
					dbWords
						.add({
							word: inputWord,
							good: 0,
						})
						.then((ref) => {
							dtools.log("Add ID: ", ref.id);
						});
				}
			});
		},
	},
};
</script>

