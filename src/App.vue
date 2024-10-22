<template>
    <nut-config-provider :theme="useDarkMode() ? 'dark' : 'light'">
      <RouterView />
    </nut-config-provider>
  
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useDarkMode } from "@/hooks/useToggleDarkMode";
import {useConfigStore} from '@/store/config';

const config = useConfigStore()
// 获取视口的高度并设置到元素的高度
const setViewportHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};


onMounted(()=>{
    // 页面加载时和窗口大小改变时调用
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('load', setViewportHeight);

    // 页面加载完成后调用
    config.getConfig()
    config.getUserInfo()
})


</script>

<style scoped lang="scss">

#nprogress .bar {
  background: var(--nut-primary-color) !important; 
}
</style>
