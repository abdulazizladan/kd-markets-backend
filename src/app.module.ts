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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // This will create a file named 'db.sqlite' in the project root
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'], // A glob pattern to load your entities
      synchronize: true, // Auto-create database schema. Use with caution in production!

    }),
    AuthModule, 
    UserModule, 
    PaymentsModule, 
    TenantsModule, 
    PropertiesModule, MaintenanceModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
