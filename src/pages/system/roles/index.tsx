import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Radio,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RoleItem, RoleFormValues } from '@/types/role';
import { getRoleList } from '@/api/role';
// 模拟数据，后续可替换为 API
const mockRoles: RoleItem[] = [
  { id: '1', name: '超级管理员', code: 'super_admin', description: '拥有所有权限', status: 1, createdAt: '2024-01-01 10:00:00' },
  { id: '2', name: '管理员', code: 'admin', description: '系统管理权限', status: 1, createdAt: '2024-01-02 10:00:00' },
  { id: '3', name: '普通用户', code: 'user', description: '普通操作权限', status: 1, createdAt: '2024-01-03 10:00:00' },
  { id: '4', name: '访客', code: 'guest', description: '只读权限', status: 0, createdAt: '2024-01-04 10:00:00' },
];

export default function RoleManagement() {
  const [dataSource, setDataSource] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm<RoleFormValues>();

  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟请求，后续改为 request('/system/roles', ...)
      await new Promise((r) => setTimeout(r, 300));
      setDataSource(mockRoles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = searchName.trim()
    ? dataSource.filter((r) => r.name.includes(searchName) || r.code.includes(searchName))
    : dataSource;

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setModalOpen(true);
  };

  const handleEdit = (record: RoleItem) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description ?? '',
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDataSource((prev) => prev.filter((r) => r.id !== id));
      message.success('删除成功');
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        setDataSource((prev) =>
          prev.map((r) =>
            r.id === editingId
              ? {
                  ...r,
                  ...values,
                  description: values.description || undefined,
                }
              : r
          )
        );
        message.success('更新成功');
      } else {
        setDataSource((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            ...values,
            description: values.description || undefined,
            createdAt: new Date().toLocaleString('zh-CN'),
          },
        ]);
        message.success('新增成功');
      }
      setModalOpen(false);
    } catch (e) {
      if (e && typeof e === 'object' && 'errorFields' in e) return;
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<RoleItem> = [
    { title: '角色名称', dataIndex: 'name', key: 'name', width: 160 },
    { title: '角色编码', dataIndex: 'code', key: 'code', width: 140 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>{status === 1 ? '启用' : '禁用'}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该角色吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索角色名称或编码"
            prefix={<SearchOutlined />}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增角色
          </Button>
        </Space>
        <Table<RoleItem>
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑角色' : '新增角色'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="如：admin、user" disabled={!!editingId} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="选填" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
