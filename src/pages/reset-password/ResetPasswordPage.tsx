import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [formState, setFormState] = useState({
    password: '',
    code: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  return (
    <FormProfileWrapper
      buttonText="Сохранить"
      title="Восстановление пароля"
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
