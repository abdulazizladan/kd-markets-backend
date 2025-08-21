import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maintence } from 'src/maintenance/entities/maintenance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MaintenanceService {
    constructor(
        @InjectRepository(Maintence)
        private readonly maintenanceRepository: Repository<Maintence>
    ) {}

    async createMaintenance() {

    }

    async findOneMarketMaintenance(id: string) {
        return this.maintenanceRepository.findOne({where: {id}})
    }

    async findAllMaintenance() {
        return this.maintenanceRepository.find({})
    }
}
