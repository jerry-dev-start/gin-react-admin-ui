import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { removeToken } from '@/utils/storage';
import { APP_TITLE } from '@/constants';
import styles from '@/layouts/MainLayout.module.css';

const { Header, Sider, Content } = Layout;

const SIDER_WIDTH = 220;
const SIDER_COLLAPSED_WIDTH = 80;

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['system']);

  const siderMenus: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/roles',
          icon: <TeamOutlined />,
          label: '角色管理',
          onClick: () => navigate('/system/roles'),
        },
      ],
    },
  ];

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => {},
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        removeToken();
        navigate('/login', { replace: true });
      },
    },
  ];

  return (
    <Layout className={`${styles.layout} ${collapsed ? styles.layoutCollapsed : ''}`}>
      <Sider
        theme="dark"
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsible
        className={styles.sider}
      >
        <div className={styles.logo}>
          <span className={styles.logoText}>{!collapsed ? APP_TITLE : '管理'}</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          items={siderMenus}
          className={styles.menu}
          inlineCollapsed={collapsed}
        />
      </Sider>
      <Layout className={styles.mainWrap}>
        <Header className={styles.header}>
          <Space className={styles.headerLeft}>
            <span
              className={styles.trigger}
              onClick={() => setCollapsed(!collapsed)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setCollapsed((c) => !c)}
              aria-label={collapsed ? '展开菜单' : '折叠菜单'}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Typography.Text type="secondary">欢迎使用后台管理系统</Typography.Text>
          </Space>
          <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
            <Space className={styles.user} style={{ cursor: 'pointer' }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <Typography.Text>管理员</Typography.Text>
            </Space>
          </Dropdown>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

