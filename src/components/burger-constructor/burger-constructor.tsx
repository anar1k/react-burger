import { useGetIngredientsQuery } from '@/services/ingredient/api';
import { useCreateOrderMutation } from '@/services/order/api';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const [lastOrder, setLastOrder] = useState<number | null>(null);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleOrder = useCallback(() => {
    createOrder({
      ingredients: [
        '609646e4dc916e00276b286e',
        '609646e4dc916e00276b2870',
        '609646e4dc916e00276b286e',
      ],
    })
      .unwrap()
      .then(({ order }) => {
        setLastOrder(order.number);
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', getErrorMessage(error, '502'));
      });
  }, [createOrder]);

  const handleCloseModal = useCallback(() => {
    setLastOrder(null);
  }, []);

  const { data: ingredientsItems = [] } = useGetIngredientsQuery();

  const currentBun = useMemo(
    () => ingredientsItems.find(({ type }) => type === 'bun'),
    [ingredientsItems]
  );

  const ingredientsWithoutBuns = useMemo(
    () => ingredientsItems.filter(({ type }) => type !== 'bun'),
    [ingredientsItems]
  );

  const totalPrice = useMemo(() => {
    const bunPrice = currentBun?.price ?? 0;
    const ingredientsPrice = ingredientsWithoutBuns.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice * 2 + ingredientsPrice;
  }, [currentBun, ingredientsWithoutBuns]);

  const renderBun = useCallback(
    (position: 'top' | 'bottom', label: string): React.JSX.Element | null => {
      if (!currentBun) return null;

      return (
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
    },
    [currentBun]
  );

  const renderIngredientsList = useMemo(() => {
    if (ingredientsWithoutBuns.length === 0) return <div>Добавьте ингредиенты</div>;

    return ingredientsWithoutBuns.map((ingredientItem) => (
      <div key={ingredientItem._id} className={styles.ingredient_item}>
        <DragIcon type="primary" className={styles.icon} />
        <ConstructorElement
          price={ingredientItem.price}
          text={ingredientItem.name}
          thumbnail={ingredientItem.image}
        />
      </div>
    ));
  }, [ingredientsWithoutBuns]);

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={styles.ingredients_wrapper}>
          {renderBun('top', 'верх')}

          <div className={styles.ingredients_list + ' custom-scroll'}>
            {renderIngredientsList}
          </div>

          {renderBun('bottom', 'низ')}
        </div>

        <div className={styles.order_wrapper}>
          <div>
            <span className="text text_type_digits-medium pr-2"> {totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>

          <Button
            htmlType="button"
            onClick={() => handleOrder()}
            size="large"
            type="primary"
            disabled={isLoading || !currentBun}
          >
            {isLoading ? 'Оформление...' : 'Оформить заказ'}
          </Button>
        </div>
      </section>

      {lastOrder && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails currentOrder={lastOrder} />
        </Modal>
      )}
    </>
  );
};
