import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { BurgerIngredientCard } from '../burger-ingredient-card/burger-ingredient-card';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import type {
  GroupedIngredients,
  TabIngredients,
  TabsIngredients,
} from './burger-ingredients.types';
import type { TIngredient } from '@/utils/types';

import styles from './burger-ingredients.module.css';

export type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const tabsValues: TabsIngredients = [
    {
      value: 'bun',
      label: 'Булки',
    },
    {
      value: 'main',
      label: 'Начинки',
    },
    {
      value: 'sauce',
      label: 'Соусы',
    },
  ];

  const groupedIngredients = ingredients.reduce((acc, item) => {
    const type = item.type;
    acc[type] = acc[type] ?? [];
    acc[type].push(item);
    return acc;
  }, {} as GroupedIngredients);

  const groupedIngredientsWithTitle = tabsValues.map(({ label, value }) => ({
    title: label,
    items: groupedIngredients[value],
  }));

  const [tabItem, setTabItem] = useState<TabIngredients>(tabsValues[0]);

  const handleTabClick = (tabItem: TabIngredients): void => {
    setTabItem(tabItem);
  };

  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav className="mb-10">
          <ul className={styles.menu}>
            {tabsValues.map((tabEl) => (
              <Tab
                key={tabEl.value}
                value={tabEl.value}
                active={tabItem.value === tabEl.value}
                onClick={() => handleTabClick(tabEl)}
              >
                {tabEl.label}
              </Tab>
            ))}
          </ul>
        </nav>

        <div className={styles.ingredients_wrapper + ' custom-scroll'}>
          {groupedIngredientsWithTitle.map(({ title, items }, index) => (
            <div key={title + index}>
              <div className="text text_type_main-medium mb-6">{title}</div>

              <div className={styles.burger_tab_content}>
                {items.map((ingredientItem) => (
                  <BurgerIngredientCard
                    key={ingredientItem._id}
                    ingredient={ingredientItem}
                    onClick={() => setSelectedIngredient(ingredientItem)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedIngredient && (
        <Modal header="Детали ингредиента" onClose={() => setSelectedIngredient(null)}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
