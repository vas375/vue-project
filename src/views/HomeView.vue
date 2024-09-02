<template>
  <div class="home-wrap">
    <div class="demo">
      <nut-button class="button">button</nut-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'

onMounted(() => {})
</script>
<style lang="scss" scoped>
.home-wrap {
  height: 100vh;
  background: #f1f1f1;
  width: 100vw;
  margin: 0 auto;
  padding: 0 15px;
  .button {
    background-color: #704eed;
    color: #fff;
    height: 2.0834rem;
    border-radius: 40px;
    width: 345px;
    font-size: 0.729rem;
    margin: 0 auto !important;
  }
}
.demo {
  width: 800px;
  height: 50px;
  background: red;
  margin: 0 auto;
}
</style>
