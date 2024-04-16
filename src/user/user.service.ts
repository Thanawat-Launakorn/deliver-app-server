import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@gmail.com',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria@gmail.com',
      password: 'guess',
    },
  ];

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
