import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants/tenants.controller';

@Module({
  controllers: [TenantsController]
})
export class TenantsModule {}
