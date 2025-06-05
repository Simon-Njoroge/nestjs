export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '1d';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export const ROLES_KEY = 'roles';
export const IS_PUBLIC_KEY = 'isPublic';
