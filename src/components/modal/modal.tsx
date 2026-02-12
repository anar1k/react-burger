import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  onClose: () => void;
  header?: string;
  children: React.ReactNode;
};

export const Modal = ({ children, header, onClose }: ModalProps): React.JSX.Element => {
  const modalRoot = document.getElementById('react-modals');
  if (!modalRoot) throw new Error('Modal root not found');

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      event.key === 'Escape' && onClose();
    }

    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />

      <div className={styles.modal}>
        <div className={styles.modal_wrapper + ` ${header ? 'pt-10' : 'pt-30'}`}>
          {header && <h3 className="text text_type_main-large pl-10 pr-10">{header}</h3>}

          <CloseIcon type="primary" onClick={onClose} className={styles.close_button} />

          <div className={styles.modal_content}>{children}</div>
        </div>
      </div>
    </>,
    modalRoot
  );
};
