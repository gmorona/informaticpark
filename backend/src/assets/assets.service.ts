import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto, createdByUserId?: number) {
    try {
      const data = this.toPrismaData(dto) as any;
      if (createdByUserId) {
        data.createdByUserId = createdByUserId;
      }
      const asset = await this.prisma.asset.create({ data });
      return this.formatAsset(asset);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Ya existe un activo con el código ${dto.code}`,
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    const assets = await this.prisma.asset.findMany({
      include: {
        custodian: true,
        createdByUser: { select: { id: true, name: true, email: true } },
        geoLocation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return assets.map((asset) => this.formatAsset(asset));
  }

  async findOne(id: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        custodian: true,
        createdByUser: { select: { id: true, name: true, email: true } },
        geoLocation: true,
      },
    });
    if (!asset) {
      throw new NotFoundException(`Activo con id ${id} no encontrado`);
    }
    return this.formatAsset(asset);
  }

  async update(id: number, dto: UpdateAssetDto) {
    await this.findOne(id);
    try {
      const data = this.toPrismaData(dto) as any;
      const asset = await this.prisma.asset.update({
        where: { id },
        data,
        include: {
          custodian: true,
          createdByUser: { select: { id: true, name: true, email: true } },
        },
      });
      return this.formatAsset(asset);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Ya existe un activo con el código proporcionado`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  private formatAsset(asset: any) {
    return {
      ...asset,
      initialValue: asset.initialValue ? parseFloat(asset.initialValue) : null,
      currentValue: asset.currentValue ? parseFloat(asset.currentValue) : null,
    };
  }

  private toPrismaData(dto: CreateAssetDto | UpdateAssetDto) {
    const data: Record<string, unknown> = {};
    const fields = [
      'code',
      'previousCode',
      'assetName',
      'brand',
      'model',
      'serialNumber',
      'location',
      'physicalLocation',
      'accountCode',
      'note',
      'custodianId',
      'locationId',
    ] as const;
    for (const f of fields) {
      const v = (dto as Record<string, unknown>)[f];
      if (v !== undefined) data[f] = v;
    }
    if ((dto as CreateAssetDto).entryDate !== undefined) {
      data.entryDate = new Date((dto as CreateAssetDto).entryDate!);
    }
    if ((dto as CreateAssetDto).activationDate !== undefined) {
      data.activationDate = new Date((dto as CreateAssetDto).activationDate!);
    }
    if ((dto as CreateAssetDto).initialValue !== undefined) {
      data.initialValue = new Prisma.Decimal(
        (dto as CreateAssetDto).initialValue!,
      );
    }
    if ((dto as CreateAssetDto).currentValue !== undefined) {
      data.currentValue = new Prisma.Decimal(
        (dto as CreateAssetDto).currentValue!,
      );
    }
    return data;
  }
}
