import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ConfirmMovementDto } from './dto/confirm-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';

type AuthUser = { sub?: number; role?: string; custodianId?: number | null };

const actasStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads', 'actas');
    mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
  if (allowed.includes(extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF, JPG y PNG'), false);
  }
};

@ApiTags('movements')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('assets/:assetId/movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('acta', { storage: actasStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Iniciar traspaso — queda PENDIENTE hasta que el receptor confirme' })
  @ApiParam({ name: 'assetId', description: 'ID del activo' })
  async create(
    @Param('assetId', ParseIdPipe) assetId: number,
    @Body() dto: CreateMovementDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: AuthUser },
  ) {
    const actaUrl = file ? `/uploads/actas/${file.filename}` : null;
    return this.movementsService.create(
      assetId, dto, actaUrl,
      req.user?.sub, req.user?.role, req.user?.custodianId,
    );
  }

  @Patch(':movementId/confirm')
  @UseInterceptors(FileInterceptor('actaRecepcion', { storage: actasStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Confirmar recepción del bien — adjunta acta firmada' })
  @ApiParam({ name: 'assetId', description: 'ID del activo' })
  @ApiParam({ name: 'movementId', description: 'ID del traspaso' })
  async confirm(
    @Param('assetId', ParseIdPipe) assetId: number,
    @Param('movementId', ParseIdPipe) movementId: number,
    @Body() dto: ConfirmMovementDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: AuthUser },
  ) {
    const actaRecepcionUrl = file ? `/uploads/actas/${file.filename}` : null;
    return this.movementsService.confirm(
      assetId, movementId, dto, actaRecepcionUrl,
      req.user?.sub, req.user?.role, req.user?.custodianId,
    );
  }

  @Patch(':movementId/reject')
  @ApiOperation({ summary: 'Rechazar traspaso — el bien permanece con el custodio actual' })
  @ApiParam({ name: 'assetId', description: 'ID del activo' })
  @ApiParam({ name: 'movementId', description: 'ID del traspaso' })
  async reject(
    @Param('assetId', ParseIdPipe) assetId: number,
    @Param('movementId', ParseIdPipe) movementId: number,
    @Req() req: { user: AuthUser },
  ) {
    return this.movementsService.reject(
      assetId, movementId, req.user?.role, req.user?.custodianId,
    );
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Historial de traspasos del activo' })
  @ApiParam({ name: 'assetId', description: 'ID del activo' })
  findAll(@Param('assetId', ParseIdPipe) assetId: number) {
    return this.movementsService.findAll(assetId);
  }

  @Get('pending/me')
  @ApiOperation({ summary: 'Traspasos pendientes de confirmar para el custodio autenticado' })
  async pendingForMe(@Req() req: { user: AuthUser }) {
    const custodianId = req.user?.custodianId;
    if (!custodianId) return [];
    return this.movementsService.findPendingForCustodian(custodianId);
  }
}
