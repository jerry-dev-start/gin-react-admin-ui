import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import type { ApiResponse } from '@/types/response';
import { API_SUCCESS_CODE } from '@/types/response';
import { getToken } from '@/utils/storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截：统一带上 token
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截：统一解包 { code, msg, data }，成功时只返回 data（泛型 T），失败抛错
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;
    if (body.code === API_SUCCESS_CODE) {
      // 将 data 解包给业务层，用断言避免 unknown 赋给 ApiResponse<unknown> 的类型冲突
      (response as { data: unknown }).data = body.data;
      return response;
    }
    return Promise.reject(new Error(body.msg || '请求失败'));
  },
  (error: AxiosError<{ msg?: string }>) => {
    const msg =
      error.response?.data?.msg ??
      error.response?.statusText ??
      error.message ??
      '网络异常';
    return Promise.reject(new Error(msg));
  }
);

/** 请求配置：与 axios 保持一致，便于扩展 */
export type RequestConfig = AxiosRequestConfig;

/**
 * 发起请求并直接返回 data 泛型，不暴露 code/msg
 * 在 tsx 中调用后拿到的就是 Promise<T>，T 即 data 类型
 */
async function request<T>(config: RequestConfig): Promise<T> {
  const res = await instance.request<ApiResponse<T>>(config);
  return res.data as T;
}

request.get = function get<T>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'GET', url });
};

request.post = function post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'POST', url, data });
};

request.put = function put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'PUT', url, data });
};

request.delete = function del<T>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'DELETE', url });
};

export { request };
