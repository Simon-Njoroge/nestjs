import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants';
import { Role } from '../constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
