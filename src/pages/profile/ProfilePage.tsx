import {
  Input,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';
import { Form } from 'react-router-dom';

export const ProfilePage = (): React.JSX.Element => {
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
    <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        name="name"
        value={formState.name}
        onChange={handleChange('name')}
        placeholder="Имя"
        icon="EditIcon"
      />

      <EmailInput
        name="email"
        value={formState.email}
        onChange={handleChange('email')}
        placeholder="Логин"
        isIcon
      />

      <PasswordInput
        name="password"
        value={formState.password}
        onChange={handleChange('password')}
        placeholder="Пароль"
        icon="EditIcon"
      />
    </Form>
  );
};

export default ProfilePage;
