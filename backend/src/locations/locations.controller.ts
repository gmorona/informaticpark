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
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { TrimStringsPipe } from '../common/pipes/trim-strings.pipe';

@ApiTags('locations')
@ApiBearerAuth('JWT')
@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear ubicación (solo ADMIN)' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ status: 201, description: 'Ubicación creada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async create(@Body(TrimStringsPipe) dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ubicaciones (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de ubicaciones' })
  async findAll() {
    return this.locationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ubicación por ID (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la ubicación' })
  @ApiResponse({ status: 200, description: 'Ubicación encontrada' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada' })
  async findOne(@Param('id', ParseIdPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ubicación (solo ADMIN)' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiParam({ name: 'id', description: 'ID de la ubicación' })
  @ApiResponse({ status: 200, description: 'Ubicación actualizada' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada' })
  async update(
    @Param('id', ParseIdPipe) id: number,
    @Body(TrimStringsPipe) dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ubicación (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la ubicación' })
  @ApiResponse({ status: 200, description: 'Ubicación eliminada' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada' })
  async remove(@Param('id', ParseIdPipe) id: number) {
    return this.locationsService.remove(id);
  }
}
