import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLocationDto) {
    return this.prisma.location.create({ data: dto });
  }

  async findAll() {
    return this.prisma.location.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`);
    }
    return location;
  }

  async update(id: number, dto: UpdateLocationDto) {
    await this.findOne(id);
    return this.prisma.location.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.location.delete({ where: { id } });
  }
}
