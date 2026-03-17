import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { useForgotPasswordMutation } from '@/services/auth/api';
import { setResetPasswordAllowed } from '@/utils/api/auth-tokens';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();
  const [formState, setFormState] = useState({
    email: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  const handleSubmit = (): void => {
    forgotPassword({ email: formState.email })
      .unwrap()
      .then(() => {
        setResetPasswordAllowed();
        void navigate('/reset-password');
      })
      .catch((error: unknown) => {
        console.error(
          'Ошибка при восстановлении пароля:',
          getErrorMessage(error, '502')
        );
      });
  };

  return (
    <FormProfileWrapper
      buttonText="Восстановить"
      title="Восстановление пароля"
      onSubmit={handleSubmit}
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
