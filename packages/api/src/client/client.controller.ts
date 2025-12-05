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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
interface RequestWithUser {
  user: {
    userId: string;
    workshopId: string;
    role: string;
  };
}
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(
    @Body() createClientDto: CreateClientDto,
    @Request() req: RequestWithUser,
  ) {
    return this.clientService.create(
      createClientDto,
      req.user.userId,
      req.user.workshopId,
    );
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.clientService.findAll(req.user.workshopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.clientService.findOne(id, req.user.workshopId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: RequestWithUser,
  ) {
    return this.clientService.update(id, updateClientDto, req.user.workshopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.clientService.remove(id, req.user.workshopId);
  }
}
