import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma, PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationOrderDto } from 'src/common/dto/pagination-order.dto';
import { UUID } from 'crypto';
import { PRODUCTS_SERVICE } from 'src/config';
import { Product } from 'src/products/products.interface';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(PRODUCTS_SERVICE)
    private readonly productsClient: ClientProxy,
  ) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
    // this.productsClient = new ClientProxy('');
  }

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('OrdersService connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    const productIds = Array.from(
      new Set(createOrderDto.items.map((item) => item.productId)),
    );
    const products = await firstValueFrom(
      this.productsClient
        .send<Product[]>({ cmd: 'validateProducts' }, productIds)
        .pipe(
          catchError((err) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            throw new RpcException(err);
          }),
        ),
    );
    return products;
    // return { service: 'order micro server', createOrderDto: createOrderDto };
    // const order = await this.order.create({ data: createOrderDto });

    // if (!order) {
    //   throw new RpcException({
    //     message: `Order with id ${createOrderDto.userId} do not created`,
    //     status: HttpStatus.BAD_REQUEST,
    //   });
    // },
    // return order;
  }

  async findAll(paginationOrderDto: PaginationOrderDto) {
    const {
      status,
      orderby = 'createdAt',
      orderDirection = 'asc',
    } = paginationOrderDto;
    const { page = 1, limit = 10 } = paginationOrderDto;
    const total = await this.order.count({
      where: status ? { status } : undefined,
    });

    if (!total) {
      throw new RpcException({
        message: `There are no orders with status ${status || 'all'}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const orderBy = {
      [orderby]: orderDirection,
    };

    const orders = await this.order.findMany({
      skip,
      take: limit,
      where: status ? { status } : undefined,
      orderBy,
    });

    if (!orders) {
      throw new RpcException({
        message: `There are no orders with status ${status || 'all'}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return {
      data: orders,
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

  async changeOrderStatus(id: UUID, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    const order = await this.order.update({
      where: { id },
      data: updateOrderDto,
    });
    if (!order) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }
}
