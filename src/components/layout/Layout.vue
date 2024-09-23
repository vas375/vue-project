<template>
  <div class="layout">
    <div class="head">
      <slot name="header"></slot>
    </div>
    <div :class="[foot ? 'content1' :'content2']">
      <slot name="content"></slot>
    </div>
    <div class="foot">
      <slot name="foot"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>

const props = defineProps({
  foot:Boolean
})
</script>
<style scoped lang="scss">
.layout{
  height: 100%;
  overflow: auto;
  width: 375px;
  margin: 0 auto;
  background: var(--nut-white);
  .header{
    height: 48px;
  }
  .content1{
    height: calc(var(--vh, 1vh) * 100 - 108px) ;
    overflow-y: auto;
  }
  .content2{
    height:  calc(var(--vh, 1vh) * 100 - 48px) ;
    overflow-y: auto;
  }
  .footer{
    height: 50px;
  }
}
</style>