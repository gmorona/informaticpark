import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCustodianDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  identifier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  unit?: string;
}
