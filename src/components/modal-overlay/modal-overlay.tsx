import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const ModalOverlay = ({ onClick }: ModalOverlayProps): React.JSX.Element => {
  return <div className={styles.overlay} onClick={onClick}></div>;
};

export default ModalOverlay;
