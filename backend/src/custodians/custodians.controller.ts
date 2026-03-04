import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { CustodiansService } from './custodians.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCustodianDto } from './dto/create-custodian.dto';
import { UpdateCustodianDto } from './dto/update-custodian.dto';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { TrimStringsPipe } from '../common/pipes/trim-strings.pipe';

@ApiTags('custodians')
@ApiBearerAuth('JWT')
@Controller('custodians')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CustodiansController {
  constructor(private readonly custodiansService: CustodiansService) {}

  @Post()
  @ApiOperation({ summary: 'Crear custodio (solo ADMIN)' })
  @ApiBody({ type: CreateCustodianDto })
  @ApiResponse({ status: 201, description: 'Custodio creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  @ApiResponse({ status: 409, description: 'Identificador duplicado' })
  async create(@Body(TrimStringsPipe) dto: CreateCustodianDto) {
    return this.custodiansService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar custodios (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de custodios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async findAll() {
    return this.custodiansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener custodio por ID (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del custodio' })
  @ApiResponse({ status: 200, description: 'Custodio encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  @ApiResponse({ status: 404, description: 'Custodio no encontrado' })
  async findOne(@Param('id', ParseIdPipe) id: number) {
    return this.custodiansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar custodio (solo ADMIN)' })
  @ApiBody({ type: UpdateCustodianDto })
  @ApiParam({ name: 'id', description: 'ID del custodio' })
  @ApiResponse({ status: 200, description: 'Custodio actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  @ApiResponse({ status: 404, description: 'Custodio no encontrado' })
  @ApiResponse({ status: 409, description: 'Identificador duplicado' })
  async update(
    @Param('id', ParseIdPipe) id: number,
    @Body(TrimStringsPipe) dto: UpdateCustodianDto,
  ) {
    return this.custodiansService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar custodio (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del custodio' })
  @ApiResponse({ status: 200, description: 'Custodio eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  @ApiResponse({ status: 404, description: 'Custodio no encontrado' })
  async remove(@Param('id', ParseIdPipe) id: number) {
    return this.custodiansService.remove(id);
  }
}
