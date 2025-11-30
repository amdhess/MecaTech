import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePartDto } from './dto/update-part.dto';
import { ServiceOrderStatus } from '@prisma/client';
@Injectable()
export class PartService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPartDto: CreatePartDto) {
    return this.prisma.part.create({
      data: createPartDto,
    });
  }

  findAll() {
    return this.prisma.part.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const part = await this.prisma.part.findUnique({ where: { id } });
    if (!part) {
      throw new NotFoundException(`Part with ID "${id}" not found`);
    }
    return part;
  }

  update(id: string, updatePartDto: UpdatePartDto) {
    return this.prisma.part.update({
      where: { id },
      data: updatePartDto,
    });
  }

  async remove(id: string) {
    const activeUsage = await this.prisma.partsOnServiceOrders.findFirst({
      where: {
        partId: id,
        serviceOrder: {
          status: {
            in: [
              ServiceOrderStatus.PENDING,
              ServiceOrderStatus.WAITING,
              ServiceOrderStatus.APPROVED,
              ServiceOrderStatus.IN_PROGRESS,
            ],
          },
        },
      },
    });

    if (activeUsage) {
      throw new ConflictException(
        'Não é possível remover: Esta peça está sendo utilizada em uma Ordem de Serviço em andamento.',
      );
    }

    const part = await this.findOne(id);

    return this.prisma.part.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        sku: `${part.sku}__DELETED__${Date.now()}`,
      },
    });
  }
}
