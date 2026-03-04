import { Module } from '@nestjs/common';
import { CustodiansService } from './custodians.service';
import { CustodiansController } from './custodians.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtConfigModule } from '../auth/jwt-config.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [JwtConfigModule],
  controllers: [CustodiansController],
  providers: [CustodiansService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [CustodiansService],
})
export class CustodiansModule {}
