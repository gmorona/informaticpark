import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ConfirmMovementDto } from './dto/confirm-movement.dto';

const MOVEMENT_INCLUDE = {
  fromCustodian: true,
  toCustodian: true,
  fromLocation: true,
  toLocation: true,
  registeredBy: { select: { id: true, name: true, email: true } },
  confirmedBy: { select: { id: true, name: true, email: true } },
} as const;

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    assetId: number,
    dto: CreateMovementDto,
    actaUrl: string | null,
    registeredByUserId?: number,
    callerRole?: string,
    callerCustodianId?: number | null,
  ) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundException(`Activo con id ${assetId} no encontrado`);

    if (callerRole !== 'ADMIN') {
      if (!callerCustodianId || asset.custodianId !== callerCustodianId) {
        throw new ForbiddenException(
          'Solo puedes registrar traspasos de activos bajo tu custodia',
        );
      }
    }

    return this.prisma.assetMovement.create({
      data: {
        assetId,
        fromCustodianId: asset.custodianId,
        toCustodianId: dto.toCustodianId ?? null,
        fromLocationId: asset.locationId,
        toLocationId: dto.toLocationId ?? null,
        note: dto.note,
        actaUrl,
        registeredByUserId,
        status: 'PENDIENTE',
      },
      include: MOVEMENT_INCLUDE,
    });
  }

  async confirm(
    assetId: number,
    movementId: number,
    dto: ConfirmMovementDto,
    actaRecepcionUrl: string | null,
    callerUserId?: number,
    callerRole?: string,
    callerCustodianId?: number | null,
  ) {
    const movement = await this.prisma.assetMovement.findUnique({
      where: { id: movementId },
    });

    if (!movement || movement.assetId !== assetId) {
      throw new NotFoundException('Traspaso no encontrado');
    }
    if (movement.status !== 'PENDIENTE') {
      throw new BadRequestException('Este traspaso ya fue procesado');
    }

    if (callerRole !== 'ADMIN') {
      if (!callerCustodianId || movement.toCustodianId !== callerCustodianId) {
        throw new ForbiddenException(
          'Solo el custodio receptor puede confirmar este traspaso',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const confirmed = await tx.assetMovement.update({
        where: { id: movementId },
        data: {
          status: 'COMPLETADO',
          confirmedAt: new Date(),
          confirmedByUserId: callerUserId,
          actaRecepcionUrl,
          ...(dto.note ? { note: movement.note ? `${movement.note} | Recepción: ${dto.note}` : dto.note } : {}),
        },
        include: MOVEMENT_INCLUDE,
      });

      const updateData: Record<string, unknown> = {};
      if (movement.toCustodianId !== undefined) updateData.custodianId = movement.toCustodianId;
      if (movement.toLocationId !== undefined) updateData.locationId = movement.toLocationId;

      if (Object.keys(updateData).length > 0) {
        await tx.asset.update({ where: { id: assetId }, data: updateData });
      }

      return confirmed;
    });
  }

  async reject(
    assetId: number,
    movementId: number,
    callerRole?: string,
    callerCustodianId?: number | null,
  ) {
    const movement = await this.prisma.assetMovement.findUnique({
      where: { id: movementId },
    });

    if (!movement || movement.assetId !== assetId) {
      throw new NotFoundException('Traspaso no encontrado');
    }
    if (movement.status !== 'PENDIENTE') {
      throw new BadRequestException('Este traspaso ya fue procesado');
    }

    if (callerRole !== 'ADMIN') {
      if (!callerCustodianId || movement.toCustodianId !== callerCustodianId) {
        throw new ForbiddenException(
          'Solo el custodio receptor puede rechazar este traspaso',
        );
      }
    }

    return this.prisma.assetMovement.update({
      where: { id: movementId },
      data: { status: 'RECHAZADO' },
      include: MOVEMENT_INCLUDE,
    });
  }

  async findAll(assetId: number) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundException(`Activo con id ${assetId} no encontrado`);

    return this.prisma.assetMovement.findMany({
      where: { assetId },
      include: MOVEMENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingForCustodian(custodianId: number) {
    return this.prisma.assetMovement.findMany({
      where: { toCustodianId: custodianId, status: 'PENDIENTE' },
      include: {
        ...MOVEMENT_INCLUDE,
        asset: { select: { id: true, assetName: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
