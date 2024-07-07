import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/helpers/role';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
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

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find({});
  }

  async findOne(email: string) {
    // return this.users.find((user) => user.email === email);
    return await this.userRepository.findOneBy({ email });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }
}
