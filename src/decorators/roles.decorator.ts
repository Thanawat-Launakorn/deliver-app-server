import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/helpers/role';

export const Roles = Reflector.createDecorator<Role[]>();
