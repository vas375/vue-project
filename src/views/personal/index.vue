<template>
  <layout :foot="true">
    <template #header>
      <Header></Header>
    </template>
    <template #content>
      <div>
        <nut-button type="primary" @click="handleLoginOut">退出</nut-button>
        <nut-button   @click="toggleTheme">切换主题</nut-button>
      </div>
    </template>
    <template #foot>
      <Foot></Foot>
    </template>
  </layout>
</template>
<script lang="ts" setup>
import Header from '@/components/layout/Header.vue'
import Layout from '@/components/layout/Layout.vue'
import Foot from '@/components/layout/Footer.vue'
import { useAuthStore } from '@/store/auth';
import { useDarkMode, useToggleDarkMode } from "@/hooks/useToggleDarkMode";
import {useRouter} from 'vue-router'
import {getVipInfo} from '@/service/api'
import { onMounted } from 'vue';
const auth = useAuthStore();
const router = useRouter()

const handleLoginOut =  () => {
  auth.clearToken()
  router.replace({name:'root'})
}

const toggleTheme = (event: TouchEvent | MouseEvent) => {
  useToggleDarkMode(event);
};
const initData = async() =>{
  const res:any = await getVipInfo()
  console.log(res)
}
onMounted(()=>{
  initData()
})
</script>
<style scoped lang="scss">

</style>
