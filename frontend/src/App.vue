<template>
  <div class="bg-primary-50 w-screen h-screen">
    <div class="w-full h-full background-image">
      <Main />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Main from './pages/Main.vue'
import bgImage from './assets/bg.png'
const bgImageUrl = `url(${bgImage})`
</script>

<style scoped>
.background-image {
  background-image: v-bind(bgImageUrl);
  background-size: 50px;
}
</style>
