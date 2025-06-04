import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/schemas/user.schema';
import { AccessType } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...accessTypes: AccessType[]) => SetMetadata(ROLES_KEY, accessTypes);
