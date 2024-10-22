<template>
  <layout :foot="false">
    <template #header>
      <NavHeader></NavHeader>
    </template>
    <template #content>
      <div class="login">
        <div class="logo"><img :src="LOGO" alt="" /></div>
        <nut-form label-position="top" star-position="left" ref="formRef" :model-value="formData">
          <nut-form-item
            required
            :rules="[
              { required: true, message: '请输入姓名' },
              { validator: ruleName, message: '长度为6-12位' }
            ]"
            prop="account"
          >
            <nut-input v-model="formData.account" placeholder="请输入姓名" type="text">
              <template #left>
                <img :src="IconAccount" alt="" class="icon" />
              </template>
            </nut-input>
            <!-- <span class="error">请输入正确的账户名</span> -->
          </nut-form-item>
          <nut-form-item
            :rules="[
              { required: true, message: '请输入密码' },
              { validator: rulePwd, message: '长度为6-20位' }
            ]"
            prop="pwd"
          >
            <nut-input
              v-model="formData.pwd"
              placeholder="请输入密码"
              :type="isEyeOff ? 'password' : 'text'"
            >
              <template #left>
                <img :src="IconPwd" alt="" class="icon" />
              </template>
              <template #right>
                <img
                  :src="isEyeOff ? IconEyeOFF : IconEyeON"
                  alt=""
                  class="icon"
                  @click="isOff()"
                />
              </template>
            </nut-input>
          </nut-form-item>
          <nut-form-item>
            <nut-button type="primary" class="login-btn" @click="submit">登录</nut-button>
          </nut-form-item>
        </nut-form>

        <div class="bottom-tips">没有账号 <span @click="toRegister">立即注册</span></div>
      </div>
    </template>
  </layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { fetchLogin } from '@/service'
import { Md5 } from 'ts-md5'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import NavHeader from '@/components/layout/NavHeader.vue'
import LOGO from '@/assets/images/global/head-logo.png'
import IconAccount from '@/assets/images/login/account.png'
import IconPwd from '@/assets/images/login/pwd.png'
import IconEyeON from '@/assets/images/login/eyeon.png'
import IconEyeOFF from '@/assets/images/login/eyeoff.png'
const router = useRouter()
const auth = useAuthStore()
const formRef = ref<any>(null)
const isEyeOff = ref(true)
const formData = ref<any>({
  account: '',
  pwd: ''
})

//用户名校验规则
const ruleName = () => {
  const reg = /^[\s\S]{6,12}$/
  return reg.test(formData.value.account)
}

const rulePwd = () => {
  const reg = /^[\s\S]{6,20}$/
  return reg.test(formData.value.pwd)
}

interface ValidateResult {
  valid: boolean
  errors: any[] // 可根据实际情况修改类型，比如字符串数组或对象数组
}
const submit = async () => {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { valid, errors }: ValidateResult = await formRef.value?.validate()
  if (valid) {
    const params: any = {
      account: formData.value.account,
      pwd: Md5.hashStr(formData.value.pwd)
    }
    const res: any = await fetchLogin(params)
    auth.setToken(res.token)
    router.push({ name: 'root' })
  } else {
    console.warn('error:', errors)
    return
  }
}
// const reset = () => {
//   formRef.value?.reset()
// }

const isOff = () => {
  isEyeOff.value = !isEyeOff.value
}

const toRegister = () => {
  router.push({ name: 'register' })
}
</script>

<style lang="scss" scoped>
.login {
  width: 375px;
  margin: 0 auto;
  .logo {
    width: 100%;
    text-align: center;
    img {
      height: 73px;
      width: 256px;
      margin: 25px 0;
    }
  }
  .bottom-tips {
    text-align: center;
    margin-top: 30px;
    span {
      color: var(--nut-primary-color);
      cursor: pointer;
    }
  }
}
.login-btn {
  width: 345px;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
}
.icon {
  height: 20px;
  width: 20px;
}
:deep(.nut-cell-group__wrap) {
  box-shadow: none;
}
:deep(.nut-cell) {
  background-color: var(--nut-white) !important;
  &::after {
    border-bottom: none;
  }
}
:deep(.line) {
  &::before {
    border: none !important;
  }
}
:deep(.input-text) {
  color: #666 !important;
}
:deep(.nut-form-item__body__tips) {
  font-size: 12px;
  color: var(--nut-dark-color2);
}
</style>
