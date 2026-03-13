import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from '@components/layout/layout';
import { Home } from '@pages/home/Home';
import { IngredientModal } from '@pages/IngredientModal';
import { IngredientView } from '@pages/IngredientView';

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ingredients/:id" element={<IngredientView />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="ingredients/:id" element={<IngredientModal />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
