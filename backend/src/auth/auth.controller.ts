import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TrimStringsPipe } from '../common/pipes/trim-strings.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Token y datos del usuario' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body(TrimStringsPipe) dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
