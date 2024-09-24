<template>
  <Layout :foot="true">
    <template #header>
      <Header></Header>
    </template>
    <template #content>
      <div v-for="item in 50" :key="item">
        {{ item }}
      </div>
    </template>
    <template #foot>
      <Foot></Foot>
    </template>
  </Layout>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Layout from '@/components/layout/Layout.vue'
import Foot from '@/components/layout/Footer.vue'
onMounted(() => {})
</script>
<style lang="scss" scoped>
.home-wrap {
  width: 375px;
  margin: 0 auto;
  background: #fff;
  overflow-x: hidden;
}
</style>
