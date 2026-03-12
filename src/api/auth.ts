import { request } from '@/api/request';
import type { SsoRedirectUrlResponse } from '@/types/sso';
import type { LoginParams, LoginResult } from '@/types/user';

/** 登录：返回即 data 泛型 LoginResult */
export function loginApi(data: LoginParams) {
  return request.post<LoginResult>('/auth/login', data);
}

/** 登出 */
export function logoutApi() {
  return request.post<unknown>('/auth/logout');
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

function buildAuthUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE.startsWith('http') ? `${API_BASE}${p}` : `${API_BASE}${p}`;
}

/**
 * 单点登录（SSO）：前端整页跳转到后端 SSO 入口，由后端重定向到 IdP（CAS/SAML/OIDC 等），
 * 认证成功后回调并写入 token，再重定向前端。
 * 路径请与后端实际路由一致，例如 /auth/sso/login、/auth/cas/login。
 */
export function getSsoLoginUrl() {
  return buildAuthUrl('/auth/sso/login');
}


export function ssoLogin(code: string, state: string, codeVerifier?: string) {
  return request.post<any>('/gra/sso/login', {
    code,
    state,
    verifier: codeVerifier,
  });
}

/**
 * SSO：GET 获取统一认证跳转地址，需把业务侧回调地址传给后端。
 * 后端示例：GET /gra/sso/redirect-url?redirect_url=https%3A%2F%2F...
 *
 * @param redirectUrl 登录完成后的回跳地址（完整 URL），如 https://app.example.com/callback
 * @returns 后端返回的 data，常见为跳转 URL 字符串或 { url: string }
 */
export function ssoRedirectUrl(redirectUrl: string) {
  return request.get<SsoRedirectUrlResponse>('/gra/sso/redirect-url', {
    params: { redirect_url: redirectUrl },
  });
}
