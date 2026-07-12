import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { CustodiansModule } from './custodians/custodians.module';
import { LocationsModule } from './locations/locations.module';
import { MovementsModule } from './movements/movements.module';

@Module({
  imports: [UsersModule, AuthModule, AssetsModule, CustodiansModule, LocationsModule, MovementsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
