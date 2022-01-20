<template>
  <aside
    class="column is-2 is-fullheight section  has-background-dark"
  >
      <div>
      <img src="~assets/images/ナナシロゴ_背景透過.png" alt="">
    </div>
    <p class="menu-label is-hidden-touch has-text-white is-size-6 has-text-weight-semibold">今話してる相手</p>
    <ul class="menu-list has-text-white">
      <li v-for="member in members" :key="member.id" class="mb-3">
        <p>  {{member.member}} {{ (member.buttonStatus)? "Pressed" : ""}} </p>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
    props: ['members']
};
</script>
