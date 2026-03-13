import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtConfigModule } from '../auth/jwt-config.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [JwtConfigModule],
  controllers: [LocationsController],
  providers: [LocationsService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [LocationsService],
})
export class LocationsModule {}
