import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsInt()
  @Min(1950)
  year: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsUUID()
  @IsNotEmpty()
  clientId: string;
}
