import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import styles from '@/pages/dashboard/dashboard.module.css';

const { Title, Text } = Typography;

export default function Dashboard() {
  const stats = [
    {
      title: '访问量',
      value: 112893,
      icon: <RiseOutlined />,
      color: '#1677ff',
    },
    {
      title: '用户数',
      value: 9280,
      icon: <UserOutlined />,
      color: '#52c41a',
    },
    {
      title: '订单数',
      value: 3562,
      icon: <ShoppingCartOutlined />,
      color: '#faad14',
    },
    {
      title: '内容数',
      value: 1246,
      icon: <FileTextOutlined />,
      color: '#722ed1',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <Title level={4} style={{ margin: 0 }}>
          仪表盘
        </Title>
        <Text type="secondary">欢迎回来，这里是系统概览</Text>
      </div>

      <Row gutter={[16, 16]} className={styles.stats}>
        {stats.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card size="small" className={styles.statCard}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{ color: item.color }}>{item.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="快捷入口" size="small">
            <p className={styles.placeholder}>此处可放置图表或快捷操作入口</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="动态与通知" size="small">
            <p className={styles.placeholder}>此处可放置最新动态或系统通知</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
