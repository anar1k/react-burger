import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { useLoginMutation } from '@/services/auth/api';
import { setTokens } from '@/utils/api/auth-tokens';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';
import { type Location, useLocation, useNavigate } from 'react-router-dom';

export const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from ?? '/profile';
  const [login] = useLoginMutation();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  const handleSubmit = (): void => {
    login({ email: formState.email, password: formState.password })
      .unwrap()
      .then((res) => {
        setTokens(res.accessToken, res.refreshToken);
        void navigate(from, { replace: true });
      })
      .catch((error: unknown) => {
        console.error('Ошибка при входе:', getErrorMessage(error, '502'));
      });
  };

  return (
    <FormProfileWrapper
      buttonText="Войти"
      title="Вход"
      onSubmit={handleSubmit}
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
