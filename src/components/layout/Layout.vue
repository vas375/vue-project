<template>
  <div class="layout">
    <div class="head">
      <slot name="header"></slot>
    </div>
    <div :class="[foot ? 'content1' : 'content2']" class="scrollable-container">
      <slot name="content"></slot>
    </div>
    <div class="foot" v-if="props.foot">
      <slot name="foot"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  foot: Boolean
})
</script>
<style scoped lang="scss">
.layout {
  height: 100%;
  overflow: auto;
  width: 375px;
  margin: 0 auto;
  background: var(--nut-white);
  .header {
    height: 48px;
  }
  .content1 {
    height: calc(var(--vh, 1vh) * 100 - 108px);
    overflow-y: auto;
  }
  .content2 {
    height: calc(var(--vh, 1vh) * 100 - 48px);
    overflow-y: auto;
  }
  .footer {
    height: 50px;
  }
}
/* 隐藏滚动条，但保留滚动功能 */
.scrollable-container {
  -ms-overflow-style: none; /* IE 和 Edge */
  //scrollbar-width: thin; /* Firefox */
  scrollbar-width: none;
}

/* 针对 WebKit 浏览器 (Chrome, Safari) 的滚动条样式 */
.scrollable-container::-webkit-scrollbar {
  width: 0.1rem; /* 设置滚动条的宽度，像移动端一样 */
  height: 0.1rem; /* 水平滚动条的高度 */
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* 设置滚动条滑块的颜色 */
  border-radius: 4px; /* 滚动条滑块圆角 */
}

.scrollable-container::-webkit-scrollbar-track {
  background-color: transparent; /* 滚动条背景透明 */
}

/* 完全隐藏滚动条 */
.scrollable-container::-webkit-scrollbar {
  display: none;
}
</style>
