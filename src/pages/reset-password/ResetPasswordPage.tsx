import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { useResetPasswordMutation } from '@/services/auth/api';
import {
  clearResetPasswordAllowed,
  isResetPasswordAllowed,
} from '@/utils/api/auth-tokens';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const [formState, setFormState] = useState({
    password: '',
    code: '',
  });

  useEffect(() => {
    if (!isResetPasswordAllowed()) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  const handleSubmit = (): void => {
    resetPassword({
      password: formState.password,
      token: formState.code,
    })
      .unwrap()
      .then(() => {
        clearResetPasswordAllowed();
        void navigate('/login');
      })
      .catch((error: unknown) => {
        console.error('Ошибка при сбросе пароля:', getErrorMessage(error, '502'));
      });
  };

  if (!isResetPasswordAllowed()) {
    return <></>;
  }

  return (
    <FormProfileWrapper
      buttonText="Сохранить"
      title="Восстановление пароля"
      onSubmit={handleSubmit}
      bottomLinks={[
        {
          text: 'Вспомнили пароль?',
          link: { to: '/login', label: 'Войти' },
        },
      ]}
    >
      <PasswordInput
        icon="ShowIcon"
        name="password"
        value={formState.password}
        onChange={handleChange('password')}
        placeholder="Введите новый пароль"
      />

      <Input
        value={formState.code}
        onChange={handleChange('code')}
        placeholder="Введите код из письма"
        type="text"
      />
    </FormProfileWrapper>
  );
};

export default ResetPasswordPage;
