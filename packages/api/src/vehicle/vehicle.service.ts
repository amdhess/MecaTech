import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceOrderStatus } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createVehicleDto: CreateVehicleDto,
    userId: string,
    workshopId: string,
  ) {
    return this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        createdById: userId,
        workshopId: workshopId,
      },
      include: { client: true },
    });
  }

  findAll(workshopId: string) {
    return this.prisma.vehicle.findMany({
      where: {
        deletedAt: null,
        workshopId: workshopId,
      },
      include: { client: true },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!vehicle || vehicle.deletedAt) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found`);
    }
    return vehicle;
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto) {
    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  async remove(id: string) {
    const activeOrder = await this.prisma.serviceOrder.findFirst({
      where: {
        vehicleId: id,
        status: {
          in: [
            ServiceOrderStatus.PENDING,
            ServiceOrderStatus.WAITING,
            ServiceOrderStatus.APPROVED,
            ServiceOrderStatus.IN_PROGRESS,
          ],
        },
      },
    });

    if (activeOrder) {
      throw new ConflictException(
        'Não é possível remover: O veículo possui Ordens de Serviço ATIVAS.',
      );
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
