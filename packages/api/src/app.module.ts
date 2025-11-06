import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './client/client.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ServiceModule } from './service/service.module';
import { OrderModule } from './order/order.module';
import { PartModule } from './part/part.module';

@Module({
  imports: [
    PrismaModule,
    ClientModule,
    VehicleModule,
    ServiceModule,
    OrderModule,
    PartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
