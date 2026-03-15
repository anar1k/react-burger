import { FeedPage } from '@/pages/feed';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { HomePage } from '@/pages/home';
import { IngredientPage } from '@/pages/ingredient';
import { LoginPage } from '@/pages/login';
import { ProfilePage } from '@/pages/profile';
import { ProfileOrderPage } from '@/pages/profile-order';
import { ProfileOrdersPage } from '@/pages/profile-orders';
import { RegisterPage } from '@/pages/register';
import { ResetPasswordPage } from '@/pages/reset-password';
import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';

import { Layout } from '@components/layout';
import { ProfileWrapper } from '@components/profile-wrapper';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage as RouteObject['Component'],
      },
      {
        path: 'ingredients/:id',
        Component: IngredientPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'register',
        Component: RegisterPage,
      },
      {
        path: 'forgot-password',
        Component: ForgotPasswordPage,
      },
      {
        path: 'reset-password',
        Component: ResetPasswordPage,
      },
      {
        path: 'profile',
        Component: ProfileWrapper,
        children: [
          {
            index: true,
            Component: ProfilePage,
          },
          {
            path: 'orders',
            Component: ProfileOrdersPage,
          },
          {
            path: 'orders/:id',
            Component: ProfileOrderPage,
          },
        ],
      },
      {
        path: 'feed',
        Component: FeedPage,
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
];

const router = createBrowserRouter(routes);

export const App = (): React.JSX.Element => {
  return <RouterProvider router={router} />;
};

export default App;
