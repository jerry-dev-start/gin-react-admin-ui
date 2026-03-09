/** 登录参数 */
export interface LoginParams {
  username: string;
  password: string;
}

/** 用户信息 */
export interface UserInfo {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  roles?: string[];
}

/** 登录返回 */
export interface LoginResult {
  token: string;
  user: UserInfo;
}
