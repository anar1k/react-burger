import { useGetIngredientsQuery } from '@/services/ingredient/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '../app-header/app-header';
import { BurgerConstructor } from '../burger-constructor/burger-constructor';
import { BurgerIngredients } from '../burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { isLoading: loadingApp, error: errorApp } = useGetIngredientsQuery();

  if (errorApp) return <h2>{'Ошибка'}</h2>;

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
            <BurgerIngredients />
            <BurgerConstructor />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
