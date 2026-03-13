import { Home } from '@/pages/home';
import { IngredientPage } from '@/pages/ingredient';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from '@components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: 'ingredients/:id',
        Component: IngredientPage,
      },
    ],
  },
]);

export const App = (): React.JSX.Element => {
  return <RouterProvider router={router} />;
};

export default App;
