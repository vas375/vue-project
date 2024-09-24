import Axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from "axios";
import { useAuthStore } from '@/store/auth';
import NProgress from "../progress";
import { showToast } from '@nutui/nutui'

export enum ContentTypeEnum {
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
  // json
  JSON = "application/json;charset=UTF-8"
}

// 通信code
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1
}

// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    "Content-Type": ContentTypeEnum.FORM_URLENCODED,
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start();
        // 发送请求前，可在此携带 token
        const auth = useAuthStore();
        const token = auth.token || localStorage.getItem('token');
        if (token)  config.headers.Authorization = `${token}`;
        return config;
      },
      (error: AxiosError) => {
        showToast.warn(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        NProgress.done();
        // 与后端协定的返回字段
        const { code, data } = response.data;
        console.log(code, data)
        // const { message } = response.data;
        // 判断请求是否成功
        const isSuccess =
          data &&
          Reflect.has(response.data, "code") &&
          code === ResultEnum.SUCCESS;
        if (isSuccess) {
          return data;
        } else {
          console.log(222,response)
          // 处理请求错误
          // showFailToast(message);
          return Promise.reject(response.data);
        }
      },
      (error: AxiosError) => {
        NProgress.done();
        // 处理 HTTP 网络错误
        let message = "";
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = "请求错误";
            break;
          case 401:
            message = "未授权，请登录";
            break;
          case 403:
            message = "拒绝访问";
            break;
          case 404:
            message = `请求地址出错: ${error.response?.config?.url}`;
            break;
          case 408:
            message = "请求超时";
            break;
          case 500:
            message = "服务器内部错误";
            break;
          case 501:
            message = "服务未实现";
            break;
          case 502:
            message = "网关错误";
            break;
          case 503:
            message = "服务不可用";
            break;
          case 504:
            message = "网关超时";
            break;
          case 505:
            message = "HTTP版本不受支持";
            break;
          default:
            message = "网络连接故障";
        }

        showToast.warn(message);
        return Promise.reject(error);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 通用请求函数
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export const http = new Http(configDefault);

