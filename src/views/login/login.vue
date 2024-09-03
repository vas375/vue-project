<template>
  <div class="login">
    <nut-form label-position="top" star-position="left">
      <nut-form-item label="姓名" required>
        <nut-input v-model="formData.name" placeholder="请输入姓名" type="text">
          <template #left> 121 </template>
          <template #right> 122 </template>
        </nut-input>
      </nut-form-item>
      <nut-form-item label="年龄" required star-position="left">
        <nut-input v-model="formData.age" placeholder="请输入年龄" type="text" />
      </nut-form-item>
      <nut-form-item>
        <nut-button type="primary" class="login-btn" @click="handleLogin">登录</nut-button>
      </nut-form-item>
    </nut-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { fetchLogin } from '@/service/api'
import { Md5 } from 'ts-md5'
const formData = ref<any>({
  name: '',
  age: ''
})

const handleLogin = async () => {
  const params: any = {
    account: '',
    pwd: Md5.hashStr('')
  }
  const res: any = await fetchLogin(params)
  console.log(res)
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
