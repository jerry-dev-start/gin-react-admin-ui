/**
 * Casdoor 前端配置（与 casdoor-js-sdk 的 SdkConfig 一致，便于集中维护）
 * 实际初始化见 src/lib/casdoor.ts
 */
export interface CasdoorEnvConfig {
  /** Casdoor 服务根地址，如 https://door.example.com */
  serverUrl: string;
  /** 应用在 Casdoor 中的 Client ID */
  clientId: string;
  /** 应用名 */
  appName: string;
  /** 组织名 */
  organizationName: string;
  /** OAuth 回调路径（需与 Casdoor 应用里配置的 Redirect URLs 一致），默认 /callback */
  redirectPath?: string;
  /** 换 token 的接口路径，默认 /api/signin */
  signinPath?: string;
  /** 可选 scope */
  scope?: string;
}
