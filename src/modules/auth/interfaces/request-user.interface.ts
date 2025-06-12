// src/auth/interfaces/request-user.interface.ts
export interface RequestUser {
  sub: number; // or `id` if you used `id` in the payload
  email: string;
  claims?: string[];
  role?: string;
}
