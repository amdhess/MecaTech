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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

interface RequestWithUser {
  user: { userId: string; workshopId: string };
}

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.serviceService.create(
      createServiceDto,
      req.user.userId,
      req.user.workshopId,
    );
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.serviceService.findAll(req.user.workshopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}
