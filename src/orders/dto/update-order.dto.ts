import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { OrdersStatus, OrderStatusList } from './order.interface';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalAmount?: number;

  @IsInt()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  items?: number;

  @IsIn(OrderStatusList)
  @IsOptional()
  status?: OrdersStatus;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsDate()
  @IsOptional()
  paidAt?: Date;
}
