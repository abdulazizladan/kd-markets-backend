import { Module } from '@nestjs/common';
import { MaintenanceService } from './services/maintenance/maintenance.service';
import { MaintenanceController } from './controller/maintenance/maintenance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintence } from './entities/maintenance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
    [
      Maintence
    ]
  )
  ],
  providers: [MaintenanceService],
  controllers: [MaintenanceController]
})
export class MaintenanceModule {}
