/** 角色列表项 */
export interface RoleItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 0 | 1; // 0 禁用 1 启用
  createdAt?: string;
}

/** 角色表单（新增/编辑） */
export interface RoleFormValues {
  name: string;
  code: string;
  description?: string;
  status: 0 | 1;
}
