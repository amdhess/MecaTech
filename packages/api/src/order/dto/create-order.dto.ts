import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderPartDto } from './create-order-part.dto';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  serviceIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderPartDto)
  parts: CreateOrderPartDto[];
}
