/**
 * 后端统一响应格式
 * 业务请求返回此结构，封装后调用方直接拿到 data 泛型
 */
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

/** 业务成功码，通常 200 表示成功 */
export const API_SUCCESS_CODE = 200;
