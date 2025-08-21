import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Maintence } from 'src/maintenance/entities/maintenance.entity';
import { MaintenanceService } from 'src/maintenance/services/maintenance/maintenance.service';

@Controller('maintenance')
export class MaintenanceController {
    constructor(
        private readonly maintenanceService: MaintenanceService
    ) {}

    @ApiOperation({summary: 'Get all maintenance records'})
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The maintenance has been successfully created.', type: Maintence })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
    @Get()
    getAll() {
        return this.maintenanceService.findAllMaintenance()
    }
}
