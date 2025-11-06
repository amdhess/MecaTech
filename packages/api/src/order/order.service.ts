import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceOrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { vehicleId, serviceIds, parts } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const services = await tx.service.findMany({
        where: { id: { in: serviceIds } },
      });
      if (services.length !== serviceIds.length) {
        throw new NotFoundException('One or more services not found');
      }
      const totalServicesPrice = services.reduce(
        (acc, service) => acc + service.price,
        0,
      );

      let totalPartsPrice = 0;
      const partUpdates: Prisma.PrismaPromise<any>[] = [];

      for (const partDto of parts) {
        const part = await tx.part.findUnique({
          where: { id: partDto.partId },
        });

        if (!part) {
          throw new NotFoundException(
            `Part with ID ${partDto.partId} not found`,
          );
        }
        if (part.stock < partDto.quantity) {
          throw new NotFoundException(
            `Insufficient stock for part: ${part.name}`,
          );
        }

        totalPartsPrice += part.price * partDto.quantity;

        partUpdates.push(
          tx.part.update({
            where: { id: partDto.partId },
            data: { stock: { decrement: partDto.quantity } },
          }),
        );
      }

      await Promise.all(partUpdates);

      const createdOrder = await tx.serviceOrder.create({
        data: {
          vehicleId: vehicleId,
          status: ServiceOrderStatus.PENDING,
          totalPartsPrice,
          totalServicesPrice,
          totalPrice: totalPartsPrice + totalServicesPrice,
          services: {
            connect: serviceIds.map((id) => ({ id })),
          },
          parts: {
            create: parts.map((part) => ({
              quantity: part.quantity,
              part: { connect: { id: part.partId } },
            })),
          },
        },
        include: {
          vehicle: true,
          services: true,
          parts: {
            include: {
              part: true,
            },
          },
        },
      });

      return createdOrder;
    });
  }

  findAll() {
    return this.prisma.serviceOrder.findMany({
      include: {
        vehicle: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            client: true,
          },
        },
        services: true,
        parts: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Service Order with ID "${id}" not found`);
    }
    return order;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.serviceOrder.delete({
      where: { id },
    });
  }
}
