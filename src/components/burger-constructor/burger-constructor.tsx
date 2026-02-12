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

  /* TODO: Взял просто пока 1й эл, раз только верстку надо */
  const currentBun = ingredients[0];

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={styles.ingredients_wrapper}>
          <div className="pl-8">
            <ConstructorElement
              isLocked
              price={currentBun.price}
              text={currentBun.name}
              thumbnail={currentBun.image}
              type="top"
            />
          </div>

          <div className={styles.ingredients_list + ' custom-scroll'}>
            {ingredients.map((ingredientItem) => (
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

          <div className="pl-8">
            <ConstructorElement
              isLocked
              price={currentBun.price}
              text={currentBun.name}
              thumbnail={currentBun.image}
              type="bottom"
            />
          </div>
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
