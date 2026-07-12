import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('movements')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('movements')
export class PendingMovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Traspasos pendientes de confirmar para el custodio autenticado' })
  async pendingForMe(@Req() req: { user: { custodianId?: number | null } }) {
    const custodianId = req.user?.custodianId;
    if (!custodianId) return [];
    return this.movementsService.findPendingForCustodian(custodianId);
  }
}
