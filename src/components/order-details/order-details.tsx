import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  currentOrder: number;
};

export const OrderDetails = ({ currentOrder }: OrderDetailsProps): React.JSX.Element => {
  return (
    <div className="pb-30">
      <div className="text text_type_digits-large mb-8">{currentOrder}</div>

      <div className="text text_type_main-medium mb-15">идентификатор заказа</div>
      <CheckMarkIcon type="primary" className={styles.icon_success + ' mb-15'} />

      <div className="text text_type_main-default mb-2">Ваш заказ начали готовить</div>

      <div className="text text_type_main-default">
        Дождитесь готовности на орбитальной станции
      </div>
    </div>
  );
};
