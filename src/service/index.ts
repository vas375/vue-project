import { http } from '@/utils/request/index'

// 登录
export function fetchLogin(params: any) {
  return http.request({
    url: '/api/auth/login',
    method: 'post',
    params
  })
}

//
export function getVipInfo() {
  return http.request({
    url: '/api/account/vipInfo',
    method: 'get'
  })
}

export function fetchGetConfig() {
  return http.request({
    url: '/api/getConfig',
    method: 'get'
  })
}

export function fetchAccount(params: any) {
  return http.request({
    url: `/api/account/balance?address-${params}`,
    method: 'get'
  })
}

// 游戏详情odds
export function getGameConfig(params: any) {
  return http.request({
    url: `/api/getGameConfig?game_id-${params}`,
    method: 'get'
  })
}

//个人首页钱包余额
export function getBalanceWallet() {
  return http.request({
    url: `/api/account/balance`,
    method: 'get'
  })
}

// 获取所有hash游戏赔率
export function hashGameOdds() {
  return http.request({
    url: `/api/allGameConfig`,
    method: 'get'
    //headers: {'langCode':'zh'}
  })
}

// 首页轮播
export function getBannerList() {
  return http.request({
    url: `/api/getBanner`,
    method: 'get'
  })
}
//奖池详情接口
export function getPricePool() {
  return http.request({
    url: `/api/getPricePool`,
    method: 'get'
  })
}
