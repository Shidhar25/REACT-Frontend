// utils/navigation.js
export const getDashboardPath = (role) => {
  switch (role?.toUpperCase()) {
    case 'USER':
      return '/user-dashboard';
    case 'AMBULANCE_DRIVER':
      return '/ambulance-driver';
    case 'FIRE_DRIVER':
      return '/fire-truck-driver';
    case 'POLICE_OFFICER':
      return '/police-dashboard';
    case 'FIRE_STATION_ADMIN':
      return '/fire-admin-dashboard';
    case 'ADMIN':
      return '/admin-dashboard';
    case 'AMBULANCE_ADMIN':
      return '/ambulance-admin-dashboard';
    case 'POLICE_STATION_ADMIN':
      return '/police-admin-dashboard';
    default:
      return '/login';
  }
};
