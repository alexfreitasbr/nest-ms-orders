import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('OrdersService connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.order.create({ data: createOrderDto });

    if (!order) {
      throw new RpcException({
        message: `Order with id ${createOrderDto.userId} do not created`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return order;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const total = await this.order.count();
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    return {
      data: await this.order.findMany({
        skip,
        take: limit,
      }),
      meta: {
        totalPages,
        currentPage,
      },
    };
  }
  async findOne(id: string) {
    const order = await this.order.findUnique({ where: { id } });
    if (!order) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }

  async changeOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    return await this.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }
}
