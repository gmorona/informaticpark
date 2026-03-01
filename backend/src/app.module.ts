import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [UsersModule, AuthModule, AssetsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
