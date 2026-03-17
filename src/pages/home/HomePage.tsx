import { useGetIngredientsQuery } from '@/services/ingredient/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Outlet } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients';

import styles from './Home.module.css';

export const HomePage = (): React.JSX.Element => {
  const { isLoading: loadingApp, error: errorApp } = useGetIngredientsQuery();

  if (errorApp) return <h2>{'Ошибка'}</h2>;

  return (
    <>
      {loadingApp && <Preloader />}

      {!loadingApp && (
        <>
          <h1 className="text text_type_main-large mt-10 mb-5 pl-5">Соберите бургер</h1>

          <div className={`${styles['constructor-wrapper']} pl-5 pr-5`}>
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients />
              <BurgerConstructor />
            </DndProvider>
          </div>
        </>
      )}

      <Outlet />
    </>
  );
};

export default HomePage;
