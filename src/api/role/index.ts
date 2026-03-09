import { request } from '@/api/request';
import type { RoleItem } from '@/types/role';

/**
 * 获取角色列表，GET 无参数
 * 后端返回 { code: 200, msg: "", data: RoleItem[] }，封装后直接得到 data（角色数组）
 */
export function getRoleList() {
  return request.get<RoleItem[]>('role/list');
}
