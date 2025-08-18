import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants/tenants.controller';
import { TenantsService } from './services/tenants/tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Tenant
      ]
    )
  ],
  controllers: [
    TenantsController
  ],
  providers: [TenantsService]
})
export class TenantsModule {}
