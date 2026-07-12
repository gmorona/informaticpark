import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConfirmMovementDto {
  @ApiPropertyOptional({ description: 'Observaciones de la recepción' })
  @IsString()
  @IsOptional()
  note?: string;
}
