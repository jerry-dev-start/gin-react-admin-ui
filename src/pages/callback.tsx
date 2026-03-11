/**
 * 单点登录回调页（页面结构 only，业务逻辑后续自行接入）
 * 与登录页同一套视觉：深色渐变 + 网格 + 玻璃卡片
 */
import { Link,useSearchParams, useNavigate } from 'react-router-dom';
import styles from '@/pages/callback.module.css';
import { useEffect } from 'react';


export default function CallbackPage() {

  // 1. 使用 useSearchParams 获取 URL 参数工具
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 2. 直接通过 .get() 方法获取具体的参数值
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // 打印看看拿到了没
    console.log("获取到的 code:", code);
    console.log("获取到的 state:", state);

    if (code) {
      // 3. 拿到 code 后，下一步就是发给 Gin 后端
      handleLogin(code, state);
    } else {
      console.error("URL 中没有 code 参数");
    }
  }, [searchParams]);

  const handleLogin = async (code: string, state: string | null) => {

  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.floatOrb} aria-hidden />
      <div className={styles.floatOrb2} aria-hidden />

      <div className={styles.card}>
        <div className={styles.cardGlow} aria-hidden />

        <span className={styles.badge}>SSO 回调</span>

        <div className={styles.spinnerWrap} aria-hidden>
          <div className={styles.spinnerGlow} />
          <div className={styles.spinner} />
        </div>

        <h1 className={styles.title} aria-label="正在完成登录">
          {'正在完成登录'.split('').map((char, i) => (
            <span
              key={`${char}-${i}`}
              className={styles.titleChar}
              style={{ '--char-delay': `${i * 0.16}s` } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </h1>
        <p className={styles.desc}>
          正在与统一认证系统确认身份，请稍候。完成后将自动进入系统。
        </p>
        <p className={styles.hint}>若长时间停留在此页，可返回登录页重新发起登录</p>

        <Link to="/login" className={styles.link}>
          返回登录页
        </Link>
      </div>
    </div>
  );
}
