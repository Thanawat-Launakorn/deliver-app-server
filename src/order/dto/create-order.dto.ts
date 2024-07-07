export class CreateOrderDto {
  userId: number;
  addressId: number;
  products: { productId: number; quantity: number }[];
}
