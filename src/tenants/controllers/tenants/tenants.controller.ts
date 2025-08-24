import { Controller, Post, Get, Put, Delete, Param, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiResponse, 
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { CreateTenantDto } from 'src/tenants/DTOs/create-tenant.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { TenantsService } from 'src/tenants/services/tenants/tenants.service';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {

    constructor(private readonly tenantsService: TenantsService) {}

    @Post('markets')
    @ApiOperation({
        summary: 'Create a new tenant',
        description: 'Creates a new tenant for a market with the provided details including personal information, contact details, and market assignment.'
    })
    @ApiBody({
        type: CreateTenantDto,
        description: 'Tenant creation data',
        examples: {
            example1: {
                summary: 'Market Stall Tenant',
                value: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+2348012345678',
                    marketId: 'market-uuid-123',
                    stallId: 'stall-uuid-456',
                    businessName: 'Doe Enterprises',
                    businessType: 'Retail',
                    rentAmount: 50000,
                    startDate: '2024-01-01',
                    endDate: '2024-12-31'
                }
            },
            example2: {
                summary: 'Shop Tenant',
                value: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '+2348098765432',
                    marketId: 'market-uuid-123',
                    shopId: 'shop-uuid-789',
                    businessName: 'Smith Trading Co.',
                    businessType: 'Wholesale',
                    rentAmount: 75000,
                    startDate: '2024-01-01',
                    endDate: '2024-12-31'
                }
            }
        }
    })
    @ApiCreatedResponse({
        description: 'Tenant successfully created',
        type: Tenant
    })
    @ApiBadRequestResponse({
        description: 'Bad request - Invalid input data or missing required fields'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error - Failed to create tenant'
    })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() tenant: CreateTenantDto): Promise<Tenant> {
        return this.tenantsService.createTenant(tenant);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'All tenants retrieved successfully',
        type: [Tenant],
        schema: {
            example: {
                id: '',
                firstName: '',
                middleName: '',
                lastName: '',
                contactEmail: '',
                contactNumber: '',
                shops: [],
                stalls: [],
                rentPayment: []
            }
        }
    })
    @Get()
    @ApiOperation({
        summary: 'Get all tenants',
        description: 'Retrieves all tenants in the system with their associated market and property information.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error - Failed to fetch tenants'
    })
    async getAll(): Promise<Tenant[]> {
        return this.tenantsService.getAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get tenant by ID',
        description: 'Retrieves a specific tenant by their unique identifier.'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the tenant',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiOkResponse({
        description: 'Tenant retrieved successfully',
        type: Tenant
    })
    @ApiNotFoundResponse({
        description: 'Tenant not found with the specified ID'
    })
    @ApiBadRequestResponse({
        description: 'Bad request - Invalid ID parameter'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error - Failed to fetch tenant'
    })
    async getByID(@Param('id') id: string): Promise<Tenant> {
        return this.tenantsService.getByID(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update tenant',
        description: 'Updates an existing tenant with the provided data. Only the fields that need to be updated should be included.'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the tenant to update',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({
        type: CreateTenantDto,
        description: 'Tenant update data',
        examples: {
            example1: {
                summary: 'Update contact information',
                value: {
                    phone: '+2348098765432',
                    email: 'newemail@example.com'
                }
            },
            example2: {
                summary: 'Update business details',
                value: {
                    businessName: 'Updated Business Name',
                    rentAmount: 60000
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Tenant updated successfully',
        type: Tenant
    })
    @ApiNotFoundResponse({
        description: 'Tenant not found with the specified ID'
    })
    @ApiBadRequestResponse({
        description: 'Bad request - Invalid input data'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error - Failed to update tenant'
    })
    async update(@Param('id') id: string, @Body() updateTenantDto: any): Promise<Tenant> {
        // TODO: Implement update logic
        return this.tenantsService.getByID(id);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete tenant',
        description: 'Permanently removes a tenant from the system.'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the tenant to delete',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiNoContentResponse({
        description: 'Tenant deleted successfully'
    })
    @ApiNotFoundResponse({
        description: 'Tenant not found with the specified ID'
    })
    @ApiBadRequestResponse({
        description: 'Bad request - Invalid ID parameter'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error - Failed to delete tenant'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return this.tenantsService.remove(id);
    }
}
