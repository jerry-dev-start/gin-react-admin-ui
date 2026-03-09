import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/api/auth';
import { setToken } from '@/utils/storage';
import { APP_TITLE } from '@/constants';
import type { LoginParams } from '@/types/user';
import styles from '@/pages/login/login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginParams>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof LoginParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!form.password) {
      setError('请输入密码');
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi(form);
      setToken(res.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 科技感背景层 */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.floatOrb} aria-hidden />
      <div className={styles.floatOrb2} aria-hidden />
      <div className={styles.floatLine} aria-hidden />

      <div className={styles.card}>
        <div className={styles.cardGlow} aria-hidden />
        <div className={styles.titleWrap}>
          <span className={styles.titleIcon}>◆</span>
          <h1 className={styles.title}>{APP_TITLE}</h1>
          <span className={styles.titleIcon}>◆</span>
        </div>
        <p className={styles.subtitle}>请使用您的账号登录</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              用户名
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              placeholder="请输入用户名"
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              密码
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="请输入密码"
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
      </div>
    </div>
  );
}
