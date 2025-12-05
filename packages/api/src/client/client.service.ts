import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceOrderStatus } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClientDto: CreateClientDto, userId: string, workshopId: string) {
    return this.prisma.client.create({
      data: {
        ...createClientDto,
        createdById: userId,
        workshopId: workshopId,
      },
    });
  }

  findAll(workshopId: string) {
    return this.prisma.client.findMany({
      where: {
        deletedAt: null,
        workshopId: workshopId,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, workshopId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client || client.deletedAt) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    if (client.workshopId !== workshopId) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    return client;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    workshopId: string,
  ) {
    await this.findOne(id, workshopId);

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string, workshopId: string) {
    await this.findOne(id, workshopId);

    const activeOrder = await this.prisma.serviceOrder.findFirst({
      where: {
        vehicle: { clientId: id },
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
        'Não é possível remover: O cliente possui Ordens de Serviço ATIVAS em andamento. Finalize ou cancele as ordens primeiro.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.vehicle.updateMany({
        where: { clientId: id, workshopId },
        data: { deletedAt: now },
      });
      return tx.client.update({
        where: { id },
        data: { deletedAt: now },
      });
    });
  }
}
