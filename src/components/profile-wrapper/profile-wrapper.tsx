import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import styles from './profile-wrapper.module.css';

export const ProfileWrapper = (): React.JSX.Element => {
  const navigate = useNavigate();
  const navigation = [
    {
      to: '/profile',
      label: 'Профиль',
      end: true,
    },
    {
      to: '/profile/orders',
      label: 'История заказов',
    },
  ];

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    void navigate('/login');
  };

  return (
    <div className={`${styles['profile-wrapper']} mt-20`}>
      <div>
        <div className={`${styles.links} mb-20`}>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.link} text text_type_main-large ${isActive ? styles.link_active : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div
            className={`${styles.link} text text_type_main-large`}
            onClick={handleLogout}
          >
            Выход
          </div>
        </div>

        <div className="text text_type_main-default text_color_inactive">
          В этом разделе вы можете
          <br />
          изменить свои персональные данные
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ProfileWrapper;
