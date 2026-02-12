import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  amount?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
} & Pick<TIngredient, 'name' | 'price' | 'image'>;

export const BurgerIngredientCard = ({
  amount,
  image,
  name,
  price,
  onClick,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={image} alt={name} className={styles.img} />

      <div className={styles.price}>
        <span className="text text_type_digits-default">{price}</span>

        <CurrencyIcon type="primary" />
      </div>

      <div className="text text_type_main-default">{name}</div>

      <Counter count={amount ?? 1} size="default" />
    </div>
  );
};
