<template>
  <nut-navbar title="Title" @click-right="onClick">
    <template #right> right </template>
  </nut-navbar>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const onClick = () => {
  console.log('[Navbar]: on click right')
}
</script>
<style lang="scss" scoped>
.header {
  height: 48px;
  width: 100%;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
}
</style>
