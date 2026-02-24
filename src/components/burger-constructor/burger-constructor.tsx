import { useModal } from '@/hooks/useModal';
import { useGetIngredientsQuery } from '@/services/ingredients/api';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const { data: ingredientsItems = [] } = useGetIngredientsQuery();

  const { visible, handleCloseModal, handleOpenModal } = useModal();

  const currentBun = useMemo(
    () => ingredientsItems.find(({ type }) => type === 'bun'),
    [ingredientsItems]
  );

  const ingredientsWithoutBuns = useMemo(
    () => ingredientsItems.filter(({ type }) => type !== 'bun'),
    [ingredientsItems]
  );

  const renderBun = (
    position: 'top' | 'bottom',
    label: string
  ): React.JSX.Element | undefined =>
    currentBun && (
      <div className="pl-8">
        <ConstructorElement
          isLocked
          price={currentBun.price}
          text={`${currentBun.name} (${label})`}
          thumbnail={currentBun.image}
          type={position}
        />
      </div>
    );

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={styles.ingredients_wrapper}>
          {renderBun('top', 'верх')}

          <div className={styles.ingredients_list + ' custom-scroll'}>
            {ingredientsWithoutBuns.map((ingredientItem) => (
              <div key={ingredientItem._id} className={styles.ingredient_item}>
                <DragIcon type="primary" className={styles.icon} />

                <ConstructorElement
                  price={ingredientItem.price}
                  text={ingredientItem.name}
                  thumbnail={ingredientItem.image}
                />
              </div>
            ))}
          </div>

          {renderBun('bottom', 'низ')}
        </div>

        <div className={styles.order_wrapper}>
          <div>
            <span className="text text_type_digits-medium pr-2">610</span>
            <CurrencyIcon type="primary" />
          </div>

          <Button
            htmlType="button"
            onClick={handleOpenModal}
            size="large"
            type="primary"
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {visible && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
