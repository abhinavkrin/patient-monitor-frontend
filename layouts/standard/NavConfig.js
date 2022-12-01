// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export const navConfig = [
  {
    title: 'Home',
    path: '/',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'Account',
    path: '/account',
    whenUnAuth: "hidden",
    icon: getIcon('eva:people-fill'),
    children: [{
      title: 'Profile',
      path: '/account/profile'
    },{
      title: 'Change Password',
      path: '/account/change-password',
    }]
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
    whenAuth: "hidden",
  },
  {
    title: 'Add Device',
    path: '/add-device',
    icon: getIcon('eva:plus-fill'),
    whenUnAuth: "hidden"
  },
  {
    title: 'Simulater',
    path: '/simulate',
    icon: getIcon('material-symbols:play-arrow'),
    whenUnAuth: "hidden"
  }
];

export const adminNavConfig = [];


