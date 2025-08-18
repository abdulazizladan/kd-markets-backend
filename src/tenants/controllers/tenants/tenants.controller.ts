import { Controller, Post, Get, Put, Delete, Param, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTenantDto } from 'src/tenants/DTOs/create-tenant.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { TenantsService } from 'src/tenants/services/tenants/tenants.service';

@Controller('tenants')
export class TenantsController {

    constructor(private readonly tenantsService: TenantsService) {}

    @ApiOperation({summary: "Add a new tenant"})
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The tenant has been successfully created.', type: Tenant })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
    @Post('markets')
    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Body() tenant: CreateTenantDto) {
        return this.tenantsService.createTenant(tenant)
    }

    @ApiOperation({summary: "Retrieve all tenants"})
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all tenants.', type: [Tenant] })
    @Get()
    getAll() {
        return this.tenantsService.getAll();
    }

    @ApiOperation({summary: "Retrieve a single tenant by ID"})
    @ApiParam({ name: 'id', description: 'The ID of the tenant', type: String })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the tenant.', type: Tenant })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found.' })
    @Get(':id')
    getByID(@Param('id') id: string) {
        return this.tenantsService.getByID(id);
    }

    @ApiOperation({summary: "Update an existing tenant"})
    @ApiParam({ name: 'id', description: 'The ID of the tenant to update', type: String })
    @ApiResponse({ status: HttpStatus.OK, description: 'The tenant has been successfully updated.', type: Tenant })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
    @Put()
    update(@Param('id')id: string) {

    }

    @ApiOperation({summary: "Delete a tenant by ID"})
    @ApiParam({ name: 'id', description: 'The ID of the market to delete', type: String })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The tenant has been successfully deleted.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found.' })
    @Delete()
    remove(@Param('id')id: string) {
        return this.tenantsService.remove(id);
    }
}
