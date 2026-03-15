import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';

export const RegisterPage = (): React.JSX.Element => {
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

  return (
    <FormProfileWrapper
      buttonText="Зарегистрироваться"
      title="Регистрация"
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
