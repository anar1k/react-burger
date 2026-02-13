import { useState, type Dispatch, type SetStateAction } from 'react';

type UseModal = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
};

export const useModal = (initValue = false): UseModal => {
  const [visible, setVisible] = useState(initValue);

  const handleOpenModal = (): void => {
    setVisible(true);
  };

  const handleCloseModal = (): void => {
    setVisible(false);
  };

  return {
    visible,
    setVisible,
    handleOpenModal,
    handleCloseModal,
  };
};
