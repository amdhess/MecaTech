import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceOrderStatus } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createServiceDto: CreateServiceDto,
    userId: string,
    workshopId: string,
  ) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        createdById: userId,
        workshopId: workshopId,
      },
    });
  }

  findAll(workshopId: string) {
    return this.prisma.service.findMany({
      where: {
        deletedAt: null,
        workshopId: workshopId,
      },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service || service.deletedAt) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return service;
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string) {
    const activeUsage = await this.prisma.serviceOrder.findFirst({
      where: {
        services: { some: { id } },
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

    if (activeUsage) {
      throw new ConflictException(
        'Não é possível remover: Este serviço está sendo usado em uma OS ativa.',
      );
    }

    return this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
