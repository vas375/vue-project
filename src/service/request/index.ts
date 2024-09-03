import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { showToast } from '@nutui/nutui'

// 定义接口来描述请求和响应数据
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

class HttpClient {
  private instance: AxiosInstance
  private loading: boolean

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.loading = false

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.showLoading()
        this.checkPermissions(config)
        return config
      },
      (error) => {
        this.hideLoading()
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        this.hideLoading()
        if (response.data.code !== 200) {
          showToast.fail(response.data.message || '请求失败')
          return Promise.reject(response.data.message)
        }
        return response
      },
      (error) => {
        this.hideLoading()
        showToast.fail('网络错误')
        return Promise.reject(error)
      }
    )
  }

  private showLoading(): void {
    if (!this.loading) {
      this.loading = true
      showToast.loading('加载中...')
    }
  }

  private hideLoading(): void {
    if (this.loading) {
      this.loading = false
      showToast.hide()
    }
  }

  private checkPermissions(config: InternalAxiosRequestConfig): void {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // } else {
    //   showToast.fail('请先登录')
    //   throw new Error('No permission')
    // }
  }

  // 使用 then 返回 T 类型的数据
  public async request<T = any>(config: InternalAxiosRequestConfig): Promise<T | any> {
    const response = await this.instance.request<ApiResponse<T>>(config)
    return response.data
  }

  // GET 请求
  public get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T | any>({
      url,
      method: 'GET',
      params
    })
  }

  // POST 请求
  public post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data
    })
  }
}

const apiClient = new HttpClient('')

export default apiClient
