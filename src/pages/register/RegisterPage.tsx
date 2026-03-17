import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { useRegisterMutation } from '@/services/auth/api';
import { setTokens } from '@/utils/api/auth-tokens';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';
import { type Location, useLocation, useNavigate } from 'react-router-dom';

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from ?? '/profile';
  const [register] = useRegisterMutation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  const handleSubmit = (): void => {
    register({
      name: formState.name,
      email: formState.email,
      password: formState.password,
    })
      .unwrap()
      .then((res) => {
        setTokens(res.accessToken, res.refreshToken);
        void navigate(from, { replace: true });
      })
      .catch((error: unknown) => {
        console.error('Ошибка при регистрации:', getErrorMessage(error, '502'));
      });
  };

  return (
    <FormProfileWrapper
      buttonText="Зарегистрироваться"
      title="Регистрация"
      onSubmit={handleSubmit}
      bottomLinks={[
        {
          text: 'Уже зарегистрированы?',
          link: { to: '/login', label: 'Войти' },
        },
      ]}
    >
      <Input
        name="name"
        value={formState.name}
        onChange={handleChange('name')}
        placeholder="Имя"
      />

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

export default RegisterPage;
