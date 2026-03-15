import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';

export const LoginPage = (): React.JSX.Element => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  return (
    <FormProfileWrapper
      buttonText="Войти"
      title="Вход"
      bottomLinks={[
        {
          text: 'Вы — новый пользователь?',
          link: { to: '/register', label: 'Зарегистрироваться' },
        },
        {
          text: 'Забыли пароль?',
          link: { to: '/reset-password', label: 'Восстановить пароль' },
        },
      ]}
    >
      <EmailInput
        name="email"
        value={formState.email}
        onChange={handleChange('email')}
        placeholder="E-mail"
      />

      <PasswordInput
        icon="ShowIcon"
        name="password"
        value={formState.password}
        onChange={handleChange('password')}
      />
    </FormProfileWrapper>
  );
};

export default LoginPage;
