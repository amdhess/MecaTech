import { IsEnum, IsNotEmpty } from 'class-validator';
import { ServiceOrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsEnum(ServiceOrderStatus)
  @IsNotEmpty()
  status: ServiceOrderStatus;
}
