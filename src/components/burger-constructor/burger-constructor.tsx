import { useModal } from '@/hooks/useModal';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const { visible, handleCloseModal, handleOpenModal } = useModal();

  const currentBun = ingredients.find(({ type }) => type === 'bun');
  const ingredientsWithoutBuns = ingredients.filter(({ type }) => type !== 'bun');

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={styles.ingredients_wrapper}>
          {currentBun && (
            <div className="pl-8">
              <ConstructorElement
                isLocked
                price={currentBun.price}
                text={currentBun.name + ' (верх)'}
                thumbnail={currentBun.image}
                type="top"
              />
            </div>
          )}

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

          {currentBun && (
            <div className="pl-8">
              <ConstructorElement
                isLocked
                price={currentBun.price}
                text={currentBun.name + ' (низ)'}
                thumbnail={currentBun.image}
                type="bottom"
              />
            </div>
          )}
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
