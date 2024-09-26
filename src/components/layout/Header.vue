<template>
  <nut-navbar @click-right="onClick">
    <template #left>
      <img :src="LOGO" alt=""  style="height: 24px;"/>
    </template>
    <template #right> 
      <div  v-show="!auth.isAuthenticated">
        <nut-button  @click="handleToLoginPage" class="login">login</nut-button>
        &nbsp;
        <nut-button type="primary" class="register">register</nut-button>
      </div>
      &nbsp; &nbsp;
      <img :src="International"  class="language"   @click="openLanguageShow()"/>
    </template>
  </nut-navbar>

  <nut-popup v-model:visible="show" position="bottom" round :style="{ backgroundColor:'rgba(0,0,0,0)' }">
    <div  class="popup-content">
      <div class="action-title">
      <div>语言</div>
      <div><img :src="Close"  @click="close"/></div>
    </div>
    <div class="list" v-for="(item,index) in menuItems" :key="index"  @click="choseLang(item)">
      {{ item.name }}
    </div>
    </div>
    
  </nut-popup>
  
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {useRouter} from 'vue-router'
import { useAuthStore } from '@/store/auth';
import LOGO from '@/assets/images/logo.png'
import International from '@/assets/images/international.png'
import Close from '@/assets/images/action-close.png'
import { setLocale ,$t } from "@/locales";
const auth = useAuthStore();
const router = useRouter()
const show = ref(false)
const menuItems = [
  {
    name: $t('lang.zh'),
    key:'zh-cn'
  },
  {
    name: $t("lang.en"),
    key: "en"
  },
  {
    name: '韩文',
    key: "ko"
  }
]
const onClick = () => {
  console.log('[Navbar]: on click right')
}

const handleToLoginPage = () => {
   router.push({name:'login'})
}

const openLanguageShow = ()=>{
  show.value = true
}
const close = () => {
  show.value = false
}
const choseLang = (item:any) => {
  setLocale(item.key);
}
</script>
<style lang="scss" scoped>
:deep(.nut-navbar){
  height: 48px;
  background: url(@/assets/images/header-bg.png) no-repeat ;
  background-size: 100% 100%;
}
.login{
  border: 1px solid var(--nut-primary-color);
  color: var(--nut-primary-color);
  font-weight: 600;
  border-radius: 4px;
  height: 32px;
  font-size: var(--nut-font-size-2);
}
.register{
  color: var(--nut-white);
  font-weight: 600;
  border-radius: 4px;
  height: 32px;
  font-size: var(--nut-font-size-2);
}
.language{
  height: 24px;
  width: 24px;
}
.popup-content{
  margin:0 auto;
  max-width: 430px;
  background: var(--nut-white);
  padding: var(--nut-padding);
  border-radius:  var(--nut-popup-border-radius) var(--nut-popup-border-radius)0 0;
}
.action-title{
  display: flex;
  div{
    height: 32px;
    align-items: center;
    flex: 1;
    &:nth-last-of-type(2){
     
      text-align: left;
      line-height: 32px;
    }
    &:nth-last-of-type(1){
      display: flex;
      flex-direction: row-reverse;
      img{
        height: 20px;
        width: 20px;
        cursor: pointer;
      }
    }
  }
}

.list{
  height: 40px;
  cursor: pointer;
}
:deep(.nut-popup){
  background-color: none !important;
}
</style>
