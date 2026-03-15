import {
  type TGetUserResponse,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} from '@/services/user/api';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import {
  Button,
  Input,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useEffect, useState } from 'react';
import { Form } from 'react-router-dom';

type ProfileFormState = {
  name: string;
  email: string;
  password: string;
};

export const ProfilePage = (): React.JSX.Element => {
  const queryResult = useGetCurrentUserQuery(undefined);
  const data: TGetUserResponse | undefined = queryResult.data;
  const [updateUser] = useUpdateUserMutation();
  const [initialValues, setInitialValues] = useState<
    Pick<ProfileFormState, 'name' | 'email'>
  >({
    name: '',
    email: '',
  });
  const [formState, setFormState] = useState<ProfileFormState>({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (data?.user) {
      const next = { name: data.user.name, email: data.user.email };
      setInitialValues(next);
      setFormState({ ...next, password: '' });
    }
  }, [data]);

  const isDirty =
    formState.name !== initialValues.name ||
    formState.email !== initialValues.email ||
    formState.password !== '';

  const handleChange = (name: keyof ProfileFormState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState((prev) => ({ ...prev, [name]: event.target.value }));
    };
  };

  const handleCancel = (): void => {
    setFormState({ ...initialValues, password: '' });
  };

  const handleSave = (): void => {
    updateUser({
      name: formState.name,
      email: formState.email,
      password: formState.password || '',
    })
      .then((result) => {
        if (result.data) {
          setInitialValues(result.data.user);
          setFormState({ ...result.data.user, password: '' });
        }
      })
      .catch((error: unknown) => {
        console.error(
          'Ошибка при обновлении пользователя:',
          getErrorMessage(error, '502')
        );
      });
  };

  return (
    <Form
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      onSubmit={(e) => e.preventDefault()}
    >
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

      {isDirty && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button htmlType="button" type="primary" size="medium" onClick={handleSave}>
            Сохранить
          </Button>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
        </div>
      )}
    </Form>
  );
};

export default ProfilePage;
