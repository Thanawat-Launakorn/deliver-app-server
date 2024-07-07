import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderItem, Order])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
