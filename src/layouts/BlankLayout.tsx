import type { ReactNode } from 'react';

interface BlankLayoutProps {
  children: ReactNode;
}

/** 空白布局，用于登录等单页，无侧边栏/顶栏 */
export function BlankLayout({ children }: BlankLayoutProps) {
  return <>{children}</>;
}
