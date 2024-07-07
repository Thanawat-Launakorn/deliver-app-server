import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create();
    // set other order fields
    order.user_id = createOrderDto.userId;
    order.address_id = createOrderDto.addressId;
    await this.orderRepository.save(order);

    const orderItems = await Promise.all(
      createOrderDto.products.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        const orderItem = this.orderItemRepository.create();
        orderItem.order = order;
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        return orderItem;
      }),
    );

    await this.orderItemRepository.save(orderItems);

    return order;
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        user: true,
        address: true,
        orderItems: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
}
