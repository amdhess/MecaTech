import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPartDto: CreatePartDto) {
    return this.prisma.part.create({
      data: createPartDto,
    });
  }

  findAll() {
    return this.prisma.part.findMany();
  }

  async findOne(id: string) {
    const part = await this.prisma.part.findUnique({
      where: { id },
    });
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

  remove(id: string) {
    return this.prisma.part.delete({
      where: { id },
    });
  }
}
