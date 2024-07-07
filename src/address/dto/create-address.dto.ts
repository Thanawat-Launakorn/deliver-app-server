import { methodAddress } from '../entities/address.entity';

export class CreateAddressDto {
    phone: string;
    zipCode: string;
    address: string;
    fullName: string;
    addressTitle: string;
    method: methodAddress;
}
