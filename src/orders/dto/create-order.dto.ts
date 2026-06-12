import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;

  // @IsIn(OrderStatusList)
  // @IsOptional()
  // status?: OrdersStatus;

  // @IsInt()
  // @IsNumber()
  // @IsPositive()
  // items: number;
}
