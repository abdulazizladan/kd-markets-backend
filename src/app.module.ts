import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { TenantsModule } from './tenants/tenants.module';
import { PropertiesModule } from './properties/properties.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: __dirname + '/../db.sqlite', // Use absolute path to database file
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'], // A glob pattern to load your entities
      synchronize: true, // Auto-create database schema. Use with caution in production!
      logging: ['query', 'error', 'warn'], // Enable detailed SQL query logging
      logger: 'advanced-console' // Use advanced console logger
    }),
    AuthModule, 
    UserModule, 
    PaymentsModule, 
    TenantsModule, 
    PropertiesModule, MaintenanceModule, ActivitiesModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
