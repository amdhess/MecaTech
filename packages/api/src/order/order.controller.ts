import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public } from 'src/auth/public.decorator';

interface RequestWithUser {
  user: { userId: string; workshopId: string };
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestWithUser,
  ) {
    return this.orderService.create(
      createOrderDto,
      req.user.userId,
      req.user.workshopId,
    );
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.orderService.findAll(req.user.workshopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Public()
  @Get('public/:token')
  findByToken(@Param('token') token: string) {
    return this.orderService.findByPublicToken(token);
  }

  @Public()
  @Patch('public/:token/approve')
  approveOrder(@Param('token') token: string) {
    return this.orderService.approveOrder(token);
  }

  @Public()
  @Patch('public/:token/reject')
  rejectOrder(@Param('token') token: string) {
    return this.orderService.rejectOrder(token);
  }
}
