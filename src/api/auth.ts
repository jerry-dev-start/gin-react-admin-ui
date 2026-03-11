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