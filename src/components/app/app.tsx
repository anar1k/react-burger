import { AuthChecker } from '@/components/auth-checker';
import { ProfileWrapper } from '@/components/profile-wrapper';
import { ProtectedRoute } from '@/components/protected-route';
import { FeedLayout, FeedListPage, FeedOrderPage } from '@/pages/feed';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { HomePage } from '@/pages/home';
import { IngredientPage } from '@/pages/ingredient';
import { LoginPage } from '@/pages/login';
import { ProfilePage } from '@/pages/profile';
import { ProfileOrderPage } from '@/pages/profile-order';
import { ProfileOrdersLayout, ProfileOrdersListPage } from '@/pages/profile-orders';
import { RegisterPage } from '@/pages/register';
import { ResetPasswordPage } from '@/pages/reset-password';
import { createHashRouter, type RouteObject, RouterProvider } from 'react-router-dom';

import { Layout } from '@components/layout';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: '/',
        Component: HomePage,
        children: [
          {
            path: 'ingredients/:id',
            Component: IngredientPage,
          },
        ],
      },
      {
        path: 'login',
        element: <ProtectedRoute anonymous />,
        children: [{ index: true, Component: LoginPage }],
      },
      {
        path: 'register',
        element: <ProtectedRoute anonymous />,
        children: [{ index: true, Component: RegisterPage }],
      },
      {
        path: 'forgot-password',
        element: <ProtectedRoute anonymous />,
        children: [{ index: true, Component: ForgotPasswordPage }],
      },
      {
        path: 'reset-password',
        element: <ProtectedRoute anonymous />,
        children: [{ index: true, Component: ResetPasswordPage }],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfileWrapper />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: ProfilePage },
          {
            path: 'orders',
            Component: ProfileOrdersLayout,
            children: [
              {
                path: '',
                Component: ProfileOrdersListPage,
                children: [{ path: ':id', Component: ProfileOrderPage }],
              },
            ],
          },
        ],
      },
      {
        path: 'feed',
        Component: FeedLayout,
        children: [
          {
            path: '',
            Component: FeedListPage,
            children: [{ path: ':id', Component: FeedOrderPage }],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
];

const router = createHashRouter(routes);

export const App = (): React.JSX.Element => {
  return (
    <>
      <AuthChecker />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
