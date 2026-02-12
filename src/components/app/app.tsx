import { fetchIngredients } from '@/utils/api/ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '../app-header/app-header';
import { BurgerConstructor } from '../burger-constructor/burger-constructor';
import { BurgerIngredients } from '../burger-ingredients/burger-ingredients';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loadingApp, setLoadingApp] = useState<boolean>(true);

  useEffect(() => {
    fetchIngredients()
      .then((data) => {
        setIngredients(data ?? []);
      })
      .catch(() => {
        setIngredients([]);
        console.log('Не удалось получить ингридиенты');
      })
      .finally(() => {
        setLoadingApp(false);
      });
  }, []);

  return (
    <div className={styles.app}>
      {loadingApp && <Preloader />}

      {!loadingApp && (
        <>
          <AppHeader />
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients ingredients={ingredients} />
            <BurgerConstructor ingredients={ingredients} />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
