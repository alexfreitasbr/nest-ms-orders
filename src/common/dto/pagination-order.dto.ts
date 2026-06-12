import type { OrderBy } from 'src/orders/dto/order.interface';
import {
  OrderByList,
  OrdersStatus,
  OrderStatusList,
} from 'src/orders/dto/order.interface';
import { PaginationDto } from './pagination.dto';
import { IsIn, IsOptional } from 'class-validator';

export class PaginationOrderDto extends PaginationDto {
  @IsIn(OrderStatusList)
  @IsOptional()
  status?: OrdersStatus;

  @IsIn(OrderByList)
  @IsOptional()
  orderby?: OrderBy;
}
