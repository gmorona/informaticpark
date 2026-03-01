import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtConfigModule } from '../auth/jwt-config.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [JwtConfigModule],
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService, JwtAuthGuard],
  exports: [AssetsService],
})
export class AssetsModule {}
