<template>
  <layout :foot="false">
    <template #header>
      <Header></Header>
    </template>
    <template #content>
      <div class="login">
        <nut-form label-position="top" star-position="left">
          <nut-form-item label="姓名" required>
            <nut-input v-model="formData.account" placeholder="请输入姓名" type="text">
              <template #left> icon </template>
              <template #right> icon </template>
            </nut-input>
          </nut-form-item>
          <nut-form-item label="密码" required star-position="left">
            <nut-input v-model="formData.pwd" placeholder="请输入密码" type="password" />
          </nut-form-item>
          <nut-form-item>
            <nut-button type="primary" class="login-btn" @click="handleLogin">登录</nut-button>
          </nut-form-item>
        </nut-form>
      </div>
    </template>
  </layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { fetchLogin } from '@/service/api'
import { Md5 } from 'ts-md5'
import { useAuthStore } from '@/store/auth';
import {useRouter} from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import Header from '@/components/layout/Header.vue'
const router = useRouter()
const auth = useAuthStore();
const formData = ref<any>({
  account: '',
  pwd: ''
})

const handleLogin = async () => {
  const params: any = {
    account: formData.value.account,
    pwd: Md5.hashStr(formData.value.pwd)
  }
  const res: any = await fetchLogin(params)
  auth.setToken(res.token)
  router.push({name:'root'})
}
</script>

<style lang="scss" scoped>
.login {
  width: 375px;
  margin: 0 auto;
}
.login-btn {
  width: 288px;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
}
</style>
