import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateOrderPartDto {
  @IsUUID()
  @IsNotEmpty()
  partId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
