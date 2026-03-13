import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustodianDto } from './dto/create-custodian.dto';
import { UpdateCustodianDto } from './dto/update-custodian.dto';

@Injectable()
export class CustodiansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustodianDto) {
    try {
      return await this.prisma.custodian.create({
        data: {
          fullName: dto.fullName,
          identifier: dto.identifier,
          unit: dto.unit,
          ...(dto.locationId !== undefined ? { locationId: dto.locationId } : {}),
        },
        include: { geoLocation: true, assets: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Custodio con identificador ${dto.identifier} ya existe`,
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.custodian.findMany({
      include: {
        assets: true,
        geoLocation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const custodian = await this.prisma.custodian.findUnique({
      where: { id },
      include: {
        assets: true,
        geoLocation: true,
      },
    });
    if (!custodian) {
      throw new NotFoundException(`Custodio con id ${id} no encontrado`);
    }
    return custodian;
  }

  async update(id: number, dto: UpdateCustodianDto) {
    await this.findOne(id);
    try {
      return await this.prisma.custodian.update({
        where: { id },
        data: {
          ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
          ...(dto.identifier !== undefined ? { identifier: dto.identifier } : {}),
          ...(dto.unit !== undefined ? { unit: dto.unit } : {}),
          ...(dto.locationId !== undefined ? { locationId: dto.locationId } : {}),
        },
        include: {
          assets: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Custodio con identificador proporcionado ya existe`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.custodian.delete({
      where: { id },
    });
  }
}
