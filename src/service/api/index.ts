import { http }from '@/utils/request/index' 

// 登录
export function fetchLogin(params: any) {
  return http.request({
    url: "/api/auth/login",
    method: "post",
    params
  });
}

// 
export function getVipInfo() {
  return http.request({
    url: "/api/account/vipInfo",
    method: "get",
  });
}