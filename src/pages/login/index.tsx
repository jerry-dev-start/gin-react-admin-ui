import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {loginApi, ssoRedirectUrl} from '@/api/auth';
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

  const ssoLogin = async () => {
    // 回跳地址：优先环境变量，否则当前站点 + Casdoor/SSO 回调路径（与后端约定一致）
    const redirectUrl = import.meta.env.VITE_SSO_REDIRECT_URL as string

    const data = await ssoRedirectUrl(redirectUrl);
    // 后端可能直接返回 URL 字符串，或包在对象里
    const targetUrl = data.Url
    
    if (!targetUrl || typeof targetUrl !== 'string') {
      setError('未获取到有效的 SSO 跳转地址，请检查后端返回格式');
      return;
    }
    window.location.href = targetUrl;
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
        <p className={styles.subtitle}>请使用本地账号登录，或通过单点登录进入系统</p>

        {/* 单点登录：整页跳转至统一认证，适合 CAS/SAML/OIDC 等 */}
        <button
          type="button"
          className={styles.ssoButton}
          disabled={loading}
          onClick={ssoLogin}
          aria-label="单点登录"
        >
          单点登录（SSO）
        </button>

        <div className={styles.ssoDivider}>
          <span className={styles.ssoDividerLine} />
          <span className={styles.ssoDividerText}>或使用本地账号</span>
          <span className={styles.ssoDividerLine} />
        </div>

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
