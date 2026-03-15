import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [formState, setFormState] = useState({
    email: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  return (
    <FormProfileWrapper
      buttonText="Восстановить"
      title="Восстановление пароля"
      bottomLinks={[
        {
          text: 'Вспомнили пароль?',
          link: { to: '/login', label: 'Войти' },
        },
      ]}
    >
      <EmailInput
        name="email"
        placeholder="Укажите e-mail"
        value={formState.email}
        onChange={handleChange('email')}
      />
    </FormProfileWrapper>
  );
};

export default ForgotPasswordPage;
