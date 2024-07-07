import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    return await this.addressRepository.save(createAddressDto);
  }

  async findAll() {
    return await this.addressRepository.find({
      relations: {
        user: true, 
      },
    });
  }

  async findOne(id: number) {
    return await this.addressRepository.findOneBy({ id });
  }

  async findAddressOne(userId: number) {
    return await this.addressRepository.findBy({ userId });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return await this.update(id, updateAddressDto);
  }

  async remove(id: number) {
    return await this.addressRepository.delete(id);
  }
}
