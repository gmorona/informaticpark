import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { TrimStringsPipe } from '../common/pipes/trim-strings.pipe';

@ApiTags('assets')
@ApiBearerAuth('JWT')
@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear activo' })
  @ApiBody({ type: CreateAssetDto })
  @ApiResponse({ status: 201, description: 'Activo creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Código duplicado' })
  async create(
    @Body(TrimStringsPipe) dto: CreateAssetDto,
    @Req() req: { user: { sub?: number } },
  ) {
    return this.assetsService.create(dto, req.user?.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Listar activos' })
  @ApiResponse({ status: 200, description: 'Lista de activos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener activo por ID' })
  @ApiParam({ name: 'id', description: 'ID del activo' })
  @ApiResponse({ status: 200, description: 'Activo encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Activo no encontrado' })
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar activo' })
  @ApiBody({ type: UpdateAssetDto })
  @ApiParam({ name: 'id', description: 'ID del activo' })
  @ApiResponse({ status: 200, description: 'Activo actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Activo no encontrado' })
  @ApiResponse({ status: 409, description: 'Código duplicado' })
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body(TrimStringsPipe) dto: UpdateAssetDto,
  ) {
    return this.assetsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar activo' })
  @ApiParam({ name: 'id', description: 'ID del activo' })
  @ApiResponse({ status: 200, description: 'Activo eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Activo no encontrado' })
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.assetsService.remove(id);
  }
}
