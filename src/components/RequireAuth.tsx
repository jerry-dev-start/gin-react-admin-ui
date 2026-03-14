import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '@/utils/storage';

interface RequireAuthProps {
  children: React.ReactNode;
}

/** 需要登录才能访问：无 token 时重定向到登录页 */
export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
