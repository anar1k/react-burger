import { getIngredientsCount } from '@/services/burger/selectors';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { useGetIngredientsQuery } from '@/services/ingredient/api';
import {
  setSelectedIngredient,
  clearSelectedIngredient,
} from '@/services/selectedIngredient/reducer';
import { isIngredientSelected } from '@/services/selectedIngredient/selectors';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { BurgerIngredientCard } from '../burger-ingredient-card';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';

import type {
  GroupedIngredients,
  TabIngredients,
  TabsIngredients,
} from './burger-ingredients.types';
import type { TIngredient } from '@/utils/types';

import styles from './burger-ingredients.module.css';

const TABS: TabsIngredients = [
  { value: 'bun', label: 'Булки' },
  { value: 'main', label: 'Начинки' },
  { value: 'sauce', label: 'Соусы' },
];

export const BurgerIngredients = (): React.JSX.Element => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const _isIngredientSelected = useAppSelector(isIngredientSelected);
  const { data: ingredientsItems = [] } = useGetIngredientsQuery();

  const ingredientsCount = useAppSelector(getIngredientsCount);

  const groupedIngredients = useMemo(() => {
    return ingredientsItems.reduce((acc, item) => {
      const type = item.type;
      acc[type] = acc[type] ?? [];
      acc[type].push(item);
      return acc;
    }, {} as GroupedIngredients);
  }, [ingredientsItems]);

  const groupedIngredientsWithTitle = useMemo(() => {
    return TABS.map(({ label, value }) => ({
      title: label,
      value,
      items: groupedIngredients[value] ?? [],
    }));
  }, [ingredientsItems]);

  const [tabItem, setTabItem] = useState<TabIngredients>(TABS[0]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleTabClick = (tab: TabIngredients): void => {
    setTabItem(tab);

    sectionRefs.current[tab.value]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleIngredientClick = (ingredient: TIngredient): void => {
    dispatch(setSelectedIngredient(ingredient));
    void navigate(`/ingredients/${ingredient._id}`);
  };

  // отслеживание скролла
  useEffect(() => {
    const handleScroll = (): void => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;

      let closestTab = TABS[0];
      let minDistance = Infinity;

      Object.entries(sectionRefs.current).forEach(([value, element]) => {
        if (!element) return;

        const distance = Math.abs(element.getBoundingClientRect().top - containerTop);

        if (distance < minDistance) {
          minDistance = distance;
          closestTab = TABS.find((tab) => tab.value === value) ?? TABS[0];
        }
      });

      setTabItem((prev) => (prev.value === closestTab.value ? prev : closestTab));
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return (): void => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav className="mb-10">
          <ul className={styles.menu}>
            {TABS.map((tabEl) => (
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

        <div
          ref={containerRef}
          className={`${styles.ingredients_wrapper} custom-scroll`}
        >
          {groupedIngredientsWithTitle.map(({ title, value, items }) => (
            <div
              key={value}
              ref={(el) => {
                sectionRefs.current[value] = el;
              }}
            >
              <div className="text text_type_main-medium mb-6">{title}</div>

              <div className={styles.burger_tab_content}>
                {items.map((ingredientItem) => (
                  <BurgerIngredientCard
                    key={ingredientItem._id}
                    ingredient={ingredientItem}
                    amount={ingredientsCount[ingredientItem._id]}
                    onClick={() => handleIngredientClick(ingredientItem)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {_isIngredientSelected && (
        <Modal
          header="Детали ингредиента"
          onClose={() => dispatch(clearSelectedIngredient())}
        >
          <IngredientDetails />
        </Modal>
      )}
    </>
  );
};

export default BurgerIngredients;
