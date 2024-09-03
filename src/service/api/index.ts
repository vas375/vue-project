import apiClient from '../request/index' // 引入你封装的 HttpClient

// 定义接口响应类型

// 登录
export function fetchLogin(params: any) {
  return apiClient.post<any>('/api/auth/login', params || {})
}
