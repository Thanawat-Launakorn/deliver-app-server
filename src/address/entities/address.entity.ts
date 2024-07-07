import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum methodAddress {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: methodAddress;

  @Column()
  addressTitle: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  zipCode: string;

  @Column()
  address: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  user: User;
}
