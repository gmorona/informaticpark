import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { JwtConfigModule } from '../auth/jwt-config.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [JwtConfigModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
