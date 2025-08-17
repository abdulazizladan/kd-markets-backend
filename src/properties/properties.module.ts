import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './controllers/properties/properties.controller';
import { PropertiesService } from './services/properties/properties.service';
import { Market } from './entities/market.entity';
import { Building } from './entities/building.entity';
import { Stall } from './entities/stall.entity';
import { Shop } from './entities/shop.entity';
import { Address } from './entities/address.entity';
import { RentPayment } from './entities/rent-payment.entity';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Market,
            Building,
            Stall,
            Shop,
            Address,
            RentPayment,
            Tenant
        ])
    ],
    providers: [
        PropertiesService
    ],
    controllers: [
        PropertiesController
    ],
    exports: [
        PropertiesService
    ]
})
export class PropertiesModule {}
