import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = Pick<
  TIngredient,
  'image' | 'name' | 'calories' | 'proteins' | 'carbohydrates' | 'fat'
>;

export const IngredientDetails = ({
  name,
  calories,
  proteins,
  carbohydrates,
  fat,
  image,
}: IngredientDetailsProps): React.JSX.Element => {
  const energyValueList: {
    label: string;
    value: number;
  }[] = [
    {
      label: 'Калории,ккал',
      value: calories,
    },
    {
      label: 'Белки, г',
      value: proteins,
    },
    {
      label: 'Жиры, г',
      value: fat,
    },
    {
      label: 'Углеводы, г',
      value: carbohydrates,
    },
  ];

  return (
    <div className="pb-15">
      <img src={image} alt={name} className={styles.image + ' mb-4'} />

      <div className="text text_type_main-medium mb-8">{name}</div>

      <div className={styles.list}>
        {energyValueList.map(({ label, value }, index) => (
          <div key={index + label}>
            <div className="text text_type_main-default">{label}</div>
            <div className="text text_type_digits-default">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
