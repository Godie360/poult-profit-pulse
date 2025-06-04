import { UserRole } from '../../users/schemas/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  isWorker?: boolean;
  isVet?: boolean;
  registeredBy?: string;
}
