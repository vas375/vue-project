<template>
  <div class="home-wrap">
    <Header></Header>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'

onMounted(() => {})
</script>
<style lang="scss" scoped>
.home-wrap {
  width: 375px;
  margin: 0 auto;
  background: #fff;
}
</style>
