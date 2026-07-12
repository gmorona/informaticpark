import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller';
import { PendingMovementsController } from './pending-movements.controller';
import { MovementsService } from './movements.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtConfigModule } from '../auth/jwt-config.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [JwtConfigModule],
  controllers: [MovementsController, PendingMovementsController],
  providers: [MovementsService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class MovementsModule {}
