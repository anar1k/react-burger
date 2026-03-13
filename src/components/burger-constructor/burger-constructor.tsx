import {
  addIngredient,
  setBun,
  removeIngredient,
  reorderIngredients,
  resetBurger,
} from '@/services/burger/reducer';
import { getBurgerBun, getBurgerIngredients } from '@/services/burger/selectors';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { useCreateOrderMutation } from '@/services/order/api';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ModalOverlay } from '../modal-overlay';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details';

import type { TIngredient, TIngredientWithUniqueId } from '@/utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [lastOrder, setLastOrder] = useState<number | null>(null);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const burgerBun = useAppSelector(getBurgerBun);
  const burgerIngredients = useAppSelector(getBurgerIngredients);

  const sectionDropRef = useRef<HTMLDivElement>(null);

  const [, dropTargetRef] = useDrop({
    accept: 'ingredient',
    drop: (item: { ingredient: TIngredient }) => {
      handleDrop(item.ingredient);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  dropTargetRef(sectionDropRef);

  const handleDrop = (ingredient: TIngredient): void => {
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  const handleRemoveIngredient = useCallback(
    (uniqueId: string) => {
      dispatch(removeIngredient(uniqueId));
    },
    [dispatch]
  );

  const handleOrder = useCallback(() => {
    if (!burgerBun) return;

    const orderIngredients = [
      burgerBun._id,
      ...burgerIngredients.map((item) => item._id),
      burgerBun._id,
    ];

    createOrder({ ingredients: orderIngredients })
      .unwrap()
      .then(({ order }) => {
        dispatch(resetBurger());
        setLastOrder(order.number);
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', getErrorMessage(error, '502'));
      });
  }, [createOrder, burgerBun, burgerIngredients]);

  const handleCloseModal = useCallback(() => {
    setLastOrder(null);
  }, []);

  const totalPrice = useMemo(() => {
    const bunPrice = burgerBun?.price ?? 0;
    const ingredientsPrice = burgerIngredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [burgerBun, burgerIngredients]);

  const renderBun = useCallback(
    (position: 'top' | 'bottom', label: string): React.JSX.Element | null => {
      if (!burgerBun)
        return (
          <div className="pl-8">
            <div className={'constructor-element constructor-element_pos_' + position}>
              Выберите булки
            </div>
          </div>
        );

      return (
        <div className="pl-8">
          <ConstructorElement
            isLocked
            price={burgerBun.price}
            text={`${burgerBun.name} (${label})`}
            thumbnail={burgerBun.image}
            type={position}
          />
        </div>
      );
    },
    [burgerBun]
  );

  const DraggableIngredientItem = ({
    item,
    index,
  }: {
    item: TIngredientWithUniqueId;
    index: number;
  }): React.JSX.Element => {
    const [, dragRef] = useDrag({
      type: 'constructor-ingredient',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, dropRef] = useDrop({
      accept: 'constructor-ingredient',
      hover: (draggedItem: { index: number }) => {
        if (draggedItem.index !== index) {
          dispatch(reorderIngredients({ fromIndex: draggedItem.index, toIndex: index }));
          draggedItem.index = index;
        }
      },
    });

    return (
      <div
        ref={(node) => {
          dragRef(node);
          dropRef(node);
        }}
        className={styles.ingredient_item}
      >
        <DragIcon type="primary" className={styles.icon} />
        <ConstructorElement
          price={item.price}
          text={item.name}
          thumbnail={item.image}
          handleClose={() => handleRemoveIngredient(item.uniqueId)}
        />
      </div>
    );
  };

  const renderIngredientsList = useMemo(() => {
    if (!burgerIngredients.length) {
      return (
        <div className="pl-8">
          <div className="constructor-element">Выберите начинку</div>
        </div>
      );
    }

    return burgerIngredients.map((ingredientItem, index) => (
      <DraggableIngredientItem
        key={ingredientItem.uniqueId}
        item={ingredientItem}
        index={index}
      />
    ));
  }, [burgerIngredients]);

  return (
    <>
      {isLoading && (
        <div className={styles.constructor_preloader}>
          <Preloader />
          <ModalOverlay />
        </div>
      )}

      <section className={styles.burger_constructor} ref={sectionDropRef}>
        <div className={styles.ingredients_wrapper}>
          {renderBun('top', 'верх')}

          <div className={`${styles.ingredients_list} custom-scroll`}>
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
            onClick={handleOrder}
            size="large"
            type="primary"
            disabled={isLoading || !burgerBun}
          >
            Оформить заказ
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

export default BurgerConstructor;
