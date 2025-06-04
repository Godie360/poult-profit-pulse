import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

// Define a new enum for access types that includes the special roles
export enum AccessType {
  FARMER = 'farmer',
  VET = 'vet',
  WORKER = 'worker',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AccessType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    return requiredRoles.some((accessType) => {
      if (accessType === AccessType.FARMER) {
        return user.role === UserRole.FARMER;
      } else if (accessType === AccessType.VET) {
        return user.isVet === true;
      } else if (accessType === AccessType.WORKER) {
        return user.isWorker === true;
      }
      return false;
    });
  }
}
