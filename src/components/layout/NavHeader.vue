<template>
  <nut-navbar :title="route.meta?.title">
    <template #left>
      <IconFont name="rect-left" color="#333" size="18" @click="onClick"></IconFont>
    </template>
  </nut-navbar>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const onClick = () => {
  router.go(-1)
}
</script>
<style lang="scss" scoped>
:deep(.nut-navbar) {
  height: 48px;
  background: url(@/assets/images/global/header-bg.png) no-repeat !important;
  background-size: 100% 100% !important;
}
:deep(.title) {
  color: #333 !important;
  font-size: var(--nut-font-size-3);
}
</style>
