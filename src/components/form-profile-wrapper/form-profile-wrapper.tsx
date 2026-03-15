import { Button } from '@krgaa/react-developer-burger-ui-components';
import { Form, Link } from 'react-router-dom';

import styles from './form-profile-wrapper.module.css';

type FormProfileWrapperProps = {
  children: React.ReactNode;
  bottomLinks: {
    text: string;
    link: {
      to: string;
      label: string;
    };
  }[];
  buttonText: string;
  title: string;
  onSubmit: () => void;
};

export const FormProfileWrapper = ({
  children,
  title,
  bottomLinks,
  buttonText,
  onSubmit,
}: FormProfileWrapperProps): React.JSX.Element => {
  return (
    <div className={styles['form-profile-wrapper']}>
      <h1 className="text text_type_main-medium mb-6">{title}</h1>

      <Form
        method="post"
        className={styles.form + ' mb-20'}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}

        <Button htmlType="submit" size="large" type="primary">
          {buttonText}
        </Button>
      </Form>

      <div className={styles['bottom-links']}>
        {bottomLinks.map((item, index) => (
          <div key={index} className="text text_type_main-default">
            <span>{item.text} </span>
            <Link to={item.link.to}>{item.link.label}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormProfileWrapper;
