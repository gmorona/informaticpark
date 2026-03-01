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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { TrimStringsPipe } from '../common/pipes/trim-strings.pipe';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => {
      const safe = { ...(u as any) };
      delete (safe as any).password;
      return safe;
    });
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async create(@Body(TrimStringsPipe) dto: CreateUserDto) {
    const user = await this.usersService.createUserAsAdmin(dto);
    const safe = { ...(user as any) };
    delete (safe as any).password;
    return safe;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar usuario (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async update(
    @Param('id', ParseIdPipe) id: number,
    @Body(TrimStringsPipe) dto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUserAsAdmin(id, dto);
    const safe = { ...(user as any) };
    delete (safe as any).password;
    return safe;
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar/desactivar usuario (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async activate(
    @Param('id', ParseIdPipe) id: number,
    @Body(TrimStringsPipe) dto: ActivateUserDto,
  ) {
    const user = await this.usersService.setActive(id, dto.isActive);
    const safe = { ...(user as any) };
    delete (safe as any).password;
    return safe;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete usuario (solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN' })
  async remove(@Param('id', ParseIdPipe) id: number) {
    const user = await this.usersService.softDelete(id);
    const safe = { ...(user as any) };
    delete (safe as any).password;
    return safe;
  }
}
