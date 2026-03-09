import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { RequireAuth } from '@/components/RequireAuth';
import { MainLayout } from '@/layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/login',
    lazy: () => import('@/pages/login').then((m) => ({ Component: m.default })),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: () =>
          import('@/pages/dashboard').then((m) => ({ Component: m.default })),
      },
      {
        path: 'system/roles',
        lazy: () =>
          import('@/pages/system/roles').then((m) => ({ Component: m.default })),
      },
    ],
  },
]);

export { router };
export type { RouteObject };
