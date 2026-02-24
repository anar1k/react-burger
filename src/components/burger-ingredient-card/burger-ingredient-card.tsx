import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  amount?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ingredient: TIngredient;
};

export const BurgerIngredientCard = ({
  amount,
  ingredient,
  onClick,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  const burgerCardRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'ingredient',
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(burgerCardRef);

  const { image, name, price } = ingredient;

  return (
    <div className={styles.card} onClick={onClick} ref={burgerCardRef}>
      <img src={image} alt={name} className={styles.img} />

      <div className={styles.price}>
        <span className="text text_type_digits-default">{price}</span>

        <CurrencyIcon type="primary" />
      </div>

      <div className="text text_type_main-default">{name}</div>

      {amount && <Counter count={amount} size="default" />}
    </div>
  );
};
