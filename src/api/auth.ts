import { request } from '@/api/request';
import type { LoginParams, LoginResult } from '@/types/user';

/** 登录：返回即 data 泛型 LoginResult */
export function loginApi(data: LoginParams) {
  return request.post<LoginResult>('/auth/login', data);
}

/** 登出 */
export function logoutApi() {
  return request.post<unknown>('/auth/logout');
}
