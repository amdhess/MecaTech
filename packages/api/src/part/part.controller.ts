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
import { PartService } from './part.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

interface RequestWithUser {
  user: { userId: string; workshopId: string };
}

@Controller('part')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  create(
    @Body() createPartDto: CreatePartDto,
    @Request() req: RequestWithUser,
  ) {
    return this.partService.create(
      createPartDto,
      req.user.userId,
      req.user.workshopId,
    );
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.partService.findAll(req.user.workshopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    return this.partService.update(id, updatePartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partService.remove(id);
  }
}
