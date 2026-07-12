import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMovementDto {
  @ApiPropertyOptional({ description: 'ID del nuevo custodio' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  toCustodianId?: number;

  @ApiPropertyOptional({ description: 'ID de la nueva ubicación geográfica' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  toLocationId?: number;

  @ApiPropertyOptional({ description: 'Observaciones del traspaso' })
  @IsString()
  @IsOptional()
  note?: string;
}
