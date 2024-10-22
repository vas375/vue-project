<template>
  <layout :foot="false">
    <template #header>
      <Header></Header>
    </template>
    <template #content>
      <div class="login">
        <div class="logo"> <img :src="LOGO" alt=""> </div>
        <nut-form label-position="top" star-position="left" ref="formRef" :model-value="formData">
          <nut-form-item  required :rules="[{ required: true, message: '请输入姓名' }]" prop="account">
            <nut-input v-model="formData.account" placeholder="请输入姓名" type="text">
              <template #left> 
                <img :src="IconAccount" alt=""  class="icon"/>
               </template>
            </nut-input>
            <!-- <span class="error">请输入正确的账户名</span> -->
          </nut-form-item>
          <nut-form-item  :rules="[{ required: true, message: '请输入密码' }]" prop="pwd">
            <nut-input v-model="formData.pwd" placeholder="请输入密码" :type="isEyeOff?'password':'text' " >
              <template #left>
                <img :src="IconPwd" alt="" class="icon"/>
              </template>
              <template #right> 
                <img :src="isEyeOff?IconEyeOFF: IconEyeON" alt="" class="icon"  @click="isOff()"/> </template>
            </nut-input>
          </nut-form-item>
          <nut-form-item>
            <nut-button type="primary" class="login-btn" @click="submit">登录</nut-button>
          </nut-form-item>
        </nut-form>
      </div>
    </template>
  </layout>
</template>
<script setup lang="ts">
import { ref ,computed} from 'vue'
import { fetchLogin } from '@/service'
import { Md5 } from 'ts-md5'
import { useAuthStore } from '@/store/auth';
import {useRouter} from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import Header from '@/components/layout/Header.vue'
import LOGO from '@/assets/images/global/head-logo.png'
import IconAccount from '@/assets/images/login/account.png'
import IconPwd from '@/assets/images/login/pwd.png'
import IconEyeON from '@/assets/images/login/eyeon.png'
import IconEyeOFF from '@/assets/images/login/eyeoff.png'
const router = useRouter()
const auth = useAuthStore();
const formRef = ref(null)
const isEyeOff = ref(true)
const formData = ref<any>({
  account: '',
  pwd: ''
})

//用户名校验规则
const ruleName = () => {
  const reg =  /^[\s\S]{6,12}$/
  console.log('test',reg.test(formData.value.account))
  return reg.test(formData.value.account)
}

const submit = async () => {
  
  formRef.value?.validate().then(({ valid, errors }) => {
    if (valid) {
      console.log('success:', formData.value)
    } else {
      console.warn('error:', errors)
    }
  })
  return
  const params: any = {
    account: formData.value.account,
    pwd: Md5.hashStr(formData.value.pwd)
  }
  const res: any = await fetchLogin(params)
  auth.setToken(res.token)
  router.push({name:'root'})
}
const reset = () => {
  formRef.value?.reset()
}

const isOff = () => {
  isEyeOff.value = !isEyeOff.value
}
</script>

<style lang="scss" scoped>
.login {
  width: 375px;
  margin: 0 auto;
  .logo{
    width: 100%;
    text-align: center;
    img{
      height: 73px;
      width: 256px;
      margin: 25px 0;
    }
  }
}
.login-btn {
  width: 288px;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
}
.icon{
  height: 20px;
  width: 20px;
}
:deep(.nut-cell-group__wrap ){
  box-shadow: none;
}
:deep(.nut-cell ){
  background-color: var(--nut-white) !important;
}
:deep(.input-text ){
  color: #666 !important;
}
:deep(.nut-form-item__body__tips){
  font-size: 12px;
  color: var(--nut-dark-color2);

}
</style>
