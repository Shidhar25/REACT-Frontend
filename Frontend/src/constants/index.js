// User roles (matching backend JWT roles)
export const USER_ROLES = {
  USER: 'USER',
  POLICE_OFFICER: 'POLICE_OFFICER',
  FIRE_DRIVER: 'FIRE_DRIVER',
  AMBULANCE_DRIVER: 'AMBULANCE_DRIVER',
  ADMIN: 'ADMIN',
};

// Emergency types
export const EMERGENCY_TYPES = {
  MEDICAL: 'medical',
  FIRE: 'fire',
  CRIME: 'crime',
  ACCIDENT: 'accident',
  OTHER: 'other',
};

// Emergency priorities
export const EMERGENCY_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};
