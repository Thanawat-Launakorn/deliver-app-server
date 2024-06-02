import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/helpers/role';

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@gmail.com',
      password: 'changeme',
      role: Role.ADMIN,
    },
    {
      userId: 2,
      email: 'admin@gmail.com',
      password: '1234',
      role: Role.ADMIN,
    },
    {
      userId: 3,
      email: 'maria@gmail.com',
      password: 'guess',
      role: Role.CLIENT,
    },
  ];

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
