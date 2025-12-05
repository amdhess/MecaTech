import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
// import { ServiceOrderStatus } from '@prisma/client';

//TO DO: FIX THIS CRONJOB
@Injectable()
export class OrderSchedulerService {
  private readonly logger = new Logger(OrderSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Para prod: EVERY_DAY_AT_MIDNIGHT.
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleMaintenanceReminders() {
    this.logger.debug('🔍 Verificando veículos que precisam de manutenção...');

    //Para prod: createdAt < 6 meses atrás)
    // const oldOrders = await this.prisma.serviceOrder.findMany({
    //   where: {
    //     status: {
    //       in: [ServiceOrderStatus.COMPLETED, ServiceOrderStatus.CLOSED],
    //     },
    //   },
    //   include: {
    //     vehicle: { include: { client: true } },
    //   },
    //   take: 5,
    // });

    // if (oldOrders.length === 0) {
    //   this.logger.debug('✅ Nenhuma manutenção pendente encontrada.');
    //   return;
    // }

    // for (const order of oldOrders) {
    //   const clientName = order.vehicle.client.name;
    //   const vehicleModel = order.vehicle.model;

    //   this.logger.warn(
    //     `📧 ENVIANDO LEMBRETE para ${clientName}: "Olá! Já faz tempo que seu ${vehicleModel} passou aqui. Que tal agendar uma revisão?"`,
    //   );
    // }

    this.logger.warn(
      `📧 ENVIANDO LEMBRETE para teste: "Olá! Já faz tempo que seu carro passou aqui. Que tal agendar uma revisão?"`,
    );
  }
}
