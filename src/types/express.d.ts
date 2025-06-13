// src/types/express.d.ts
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { User } from '../src/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

 // adjust path to your User entity

declare module 'express' {
  interface Request {
    user: Partial<User> & { email: string };
  }
}
