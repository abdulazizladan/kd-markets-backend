import { Controller, Post, Get, Put, Param, Body, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import {
    CreateMarketDto,
    UpdateMarketDto,
    CreateBuildingDto,
    UpdateBuildingDto,
    CreateStallDto,
    UpdateStallDto,
    CreateShopDto,
    UpdateShopDto,
    CreateRentPaymentDto,
    UpdateRentPaymentDto,
  } from '../../DTOs/properties.dto';
  import { PropertiesService } from 'src/properties/services/properties/properties.service';
  import { Market } from '../../entities/market.entity';
import { Building } from '../../entities/building.entity';
import { Stall } from '../../entities/stall.entity';
import { Shop } from '../../entities/shop.entity';
import { RentPayment } from '../../entities/rent-payment.entity';

import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {

    constructor(private readonly propertiesService: PropertiesService) {}

    // --- Market Endpoints ---
  
  @ApiTags('Properties', 'Markets')
  @ApiOperation({ 
    summary: 'Create a new market',
    description: 'Creates a new market with the provided details including name, location, description, and capacity information.'
  })
  @ApiBody({
    type: CreateMarketDto,
    description: 'Market creation data',
    examples: {
      example1: {
        summary: 'Central Market',
        value: {
          name: 'Central Market',
          address: {
            streetAddress: 'Ahmadu Bello Way by Emir Rd',
            town: 'Kaduna',
            lga: 'Kaduna North',
            state: 'Kaduna'
          },
          buildings: [
            {
              name: 'Block A',
              description: 'Main wing',
              summary: '3 floors with mixed-use',
              marketId: 'market-uuid-placeholder'
            }
          ],
          stalls: [
            {
              name: 'Stall 1',
              annualRentRate: 25000,
              marketId: 'market-uuid-placeholder'
            }
          ]
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Market successfully created',
    type: Market
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or missing required fields'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to create market'
  })
  @Post('markets')
  @HttpCode(HttpStatus.CREATED)
  async createMarket(@Body() createMarketDto: CreateMarketDto): Promise<Market> {
    return this.propertiesService.createMarket(createMarketDto);
  }

  @ApiTags('Properties', 'Markets')
  @ApiOperation({ 
    summary: 'Get all markets',
    description: 'Retrieves all markets in the system with their associated properties and tenant information.'
  })
  @ApiOkResponse({
    description: 'All markets retrieved successfully',
    type: [CreateMarketDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch markets'
  })
  @Get('markets')
  async findAllMarkets(): Promise<Market[]> {
    return this.propertiesService.findAllMarkets();
  }

  @ApiTags('Properties', 'Markets')
  @ApiOperation({ 
    summary: 'Get market by ID',
    description: 'Retrieves a specific market by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the market',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Market retrieved successfully',
    type: CreateMarketDto
  })
  @ApiNotFoundResponse({
    description: 'Market not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch market'
  })
  @Get('markets/:id')
  async findOneMarket(@Param('id') id: string): Promise<Market> {
    return this.propertiesService.findOneMarket(id);
  }

  @ApiTags('Properties', 'Markets')
  @ApiOperation({ 
    summary: 'Update market',
    description: 'Updates an existing market with the provided data. Only the fields that need to be updated should be included.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the market to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateMarketDto,
    description: 'Market update data',
    examples: {
      example1: {
        summary: 'Update market status',
        value: {
          status: 'Under Maintenance'
        }
      },
      example2: {
        summary: 'Update market capacity',
        value: {
          capacity: 600,
          description: 'Expanded market with increased capacity'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Market updated successfully',
    type: Market
  })
  @ApiNotFoundResponse({
    description: 'Market not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to update market'
  })
  @Patch('markets/:id')
  async updateMarket(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto): Promise<Market> {
    return this.propertiesService.updateMarket(id, updateMarketDto);
  }

  @ApiTags('Properties', 'Markets')
  @ApiOperation({ 
    summary: 'Delete market',
    description: 'Permanently removes a market from the system. This will also remove all associated buildings, stalls, and shops.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the market to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiNoContentResponse({
    description: 'Market deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'Market not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to delete market'
  })
  @Delete('markets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMarket(@Param('id') id: string): Promise<void> {
    return this.propertiesService.deleteMarket(id);
  }

  // --- Building Endpoints ---

  @ApiTags('Properties', 'Buildings')
  @ApiOperation({ 
    summary: 'Create a new building',
    description: 'Creates a new building within a market with the provided details including floor count, building type, and market assignment.'
  })
  @ApiBody({
    type: CreateBuildingDto,
    description: 'Building creation data',
    examples: {
      example1: {
        summary: 'Multi-story Building',
        value: {
          name: 'Building A',
          description: 'Main multi-story building',
          floorCount: 3,
          buildingType: 'Commercial',
          marketId: 'market-uuid-123',
          status: 'Active'
        }
      },
      example2: {
        summary: 'Single Story Building',
        value: {
          name: 'Building B',
          description: 'Single story retail building',
          floorCount: 1,
          buildingType: 'Retail',
          marketId: 'market-uuid-123'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Building successfully created',
    type: Building
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or missing required fields'
  })
  @ApiNotFoundResponse({
    description: 'Parent market not found'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to create building'
  })
  @Post('buildings')
  @HttpCode(HttpStatus.CREATED)
  async createBuilding(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
    return this.propertiesService.createBuilding(createBuildingDto);
  }

  @ApiTags('Properties', 'Buildings')
  @ApiOperation({ 
    summary: 'Get building by ID',
    description: 'Retrieves a specific building by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the building',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Building retrieved successfully',
    type: Building
  })
  @ApiNotFoundResponse({
    description: 'Building not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch building'
  })
  @Get('buildings/:id')
  async findOneBuilding(@Param('id') id: string): Promise<Building> {
    return this.propertiesService.findOneBuilding(id);
  }

  @ApiTags('Properties', 'Buildings')
  @ApiOperation({ 
    summary: 'Update building',
    description: 'Updates an existing building with the provided data. Only the fields that need to be updated should be included.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the building to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateBuildingDto,
    description: 'Building update data',
    examples: {
      example1: {
        summary: 'Update building status',
        value: {
          status: 'Under Renovation'
        }
      },
      example2: {
        summary: 'Update building details',
        value: {
          description: 'Updated building description',
          floorCount: 4
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Building updated successfully',
    type: Building
  })
  @ApiNotFoundResponse({
    description: 'Building not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to update building'
  })
  @Patch('buildings/:id')
  async updateBuilding(@Param('id') id: string, @Body() updateBuildingDto: UpdateBuildingDto): Promise<Building> {
    return this.propertiesService.updateBuilding(id, updateBuildingDto);
  }

  // --- Stall Endpoints ---
  
  @ApiTags('Properties', 'Stalls')
  @ApiOperation({ 
    summary: 'Get stall by ID',
    description: 'Retrieves a specific stall by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the stall',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Stall retrieved successfully',
    type: Stall
  })
  @ApiNotFoundResponse({
    description: 'Stall not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch stall'
  })
  @Get('stalls/:id')
  async findOneStall(@Param('id') id: string): Promise<Stall> {
    return this.propertiesService.findOneStall(id);
  }

  @ApiTags('Properties', 'Stalls')
  @ApiOperation({ 
    summary: 'Update stall',
    description: 'Updates an existing stall with the provided data. Only the fields that need to be updated should be included.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the stall to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateStallDto,
    description: 'Stall update data',
    examples: {
      example1: {
        summary: 'Update stall status',
        value: {
          status: 'Occupied'
        }
      },
      example2: {
        summary: 'Update stall details',
        value: {
          description: 'Updated stall description',
          rentAmount: 25000
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Stall updated successfully',
    type: Stall
  })
  @ApiNotFoundResponse({
    description: 'Stall not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to update stall'
  })
  @Patch('stalls/:id')
  async updateStall(@Param('id') id: string, @Body() updateStallDto: UpdateStallDto): Promise<Stall> {
    return this.propertiesService.updateStall(id, updateStallDto);
  }

  // --- Shop Endpoints ---
  
  @ApiTags('Properties', 'Shops')
  @ApiOperation({ 
    summary: 'Create a new shop',
    description: 'Creates a new shop within a building with the provided details including shop type, size, and building assignment.'
  })
  @ApiBody({
    type: CreateShopDto,
    description: 'Shop creation data',
    examples: {
      example1: {
        summary: 'Retail Shop',
        value: {
          name: 'Shop 101',
          description: 'Ground floor retail shop',
          shopType: 'Retail',
          size: 50,
          buildingId: 'building-uuid-456',
          status: 'Available'
        }
      },
      example2: {
        summary: 'Wholesale Shop',
        value: {
          name: 'Shop 201',
          description: 'Second floor wholesale shop',
          shopType: 'Wholesale',
          size: 100,
          buildingId: 'building-uuid-456'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Shop successfully created',
    type: Shop
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or missing required fields'
  })
  @ApiNotFoundResponse({
    description: 'Parent building not found'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to create shop'
  })
  @Post('shops')
  @HttpCode(HttpStatus.CREATED)
  async createShop(@Body() createShopDto: CreateShopDto): Promise<Shop> {
    return this.propertiesService.createShop(createShopDto);
  }

  @ApiTags('Properties', 'Shops')
  @ApiOperation({ 
    summary: 'Get shop by ID',
    description: 'Retrieves a specific shop by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the shop',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Shop retrieved successfully',
    type: Shop
  })
  @ApiNotFoundResponse({
    description: 'Shop not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch shop'
  })
  @Get('shops/:id')
  async findOneShop(@Param('id') id: string): Promise<Shop> {
    return this.propertiesService.findOneShop(id);
  }

  @ApiTags('Properties', 'Shops')
  @ApiOperation({ 
    summary: 'Update shop',
    description: 'Updates an existing shop with the provided data. Only the fields that need to be updated should be included.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the shop to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateShopDto,
    description: 'Shop update data',
    examples: {
      example1: {
        summary: 'Update shop status',
        value: {
          status: 'Occupied'
        }
      },
      example2: {
        summary: 'Update shop details',
        value: {
          description: 'Updated shop description',
          rentAmount: 75000
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Shop updated successfully',
    type: Shop
  })
  @ApiNotFoundResponse({
    description: 'Shop not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to update shop'
  })
  @Patch('shops/:id')
  async updateShop(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto): Promise<Shop> {
    return this.propertiesService.updateShop(id, updateShopDto);
  }

  // --- Rent Payment Endpoints ---

  //@ApiTags('Rent Payments')
  @ApiOperation({ 
    summary: 'Create a new rent payment',
    description: 'Creates a new rent payment record for a property with the provided details including amount, due date, and payment method.'
  })
  @ApiBody({
    type: CreateRentPaymentDto,
    description: 'Rent payment creation data',
    examples: {
      example1: {
        summary: 'Monthly Rent Payment',
        value: {
          tenantId: 'tenant-uuid-123',
          propertyId: 'shop-uuid-456',
          amount: 75000,
          dueDate: '2024-02-01',
          paymentMethod: 'Bank Transfer',
          status: 'Pending'
        }
      },
      example2: {
        summary: 'Quarterly Rent Payment',
        value: {
          tenantId: 'tenant-uuid-789',
          propertyId: 'stall-uuid-101',
          amount: 150000,
          dueDate: '2024-04-01',
          paymentMethod: 'Cash',
          status: 'Pending'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Rent payment successfully created',
    type: RentPayment
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or missing required fields'
  })
  @ApiNotFoundResponse({
    description: 'Tenant or property not found'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to create rent payment'
  })
  @Post('rent-payments')
  @HttpCode(HttpStatus.CREATED)
  async createRentPayment(@Body() createRentPaymentDto: CreateRentPaymentDto): Promise<RentPayment> {
    return this.propertiesService.createRentPayment(createRentPaymentDto);
  }

  //@ApiTags('Rent Payments')
  @ApiOperation({ 
    summary: 'Get rent payment by ID',
    description: 'Retrieves a specific rent payment by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the rent payment',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Rent payment retrieved successfully',
    type: RentPayment
  })
  @ApiNotFoundResponse({
    description: 'Rent payment not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch rent payment'
  })
  @Get('rent-payments/:id')
  async findOneRentPayment(@Param('id') id: string): Promise<RentPayment> {
    return this.propertiesService.findOneRentPayment(id);
  }

  //@ApiTags('Rent Payments')
  @ApiOperation({ 
    summary: 'Update rent payment',
    description: 'Updates an existing rent payment with the provided data. Only the fields that need to be updated should be included.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the rent payment to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateRentPaymentDto,
    description: 'Rent payment update data',
    examples: {
      example1: {
        summary: 'Update payment status',
        value: {
          status: 'Paid',
          paidDate: '2024-01-15'
        }
      },
      example2: {
        summary: 'Update payment details',
        value: {
          amount: 80000,
          paymentMethod: 'Credit Card'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Rent payment updated successfully',
    type: RentPayment
  })
  @ApiNotFoundResponse({
    description: 'Rent payment not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to update rent payment'
  })
  @Patch('rent-payments/:id')
  async updateRentPayment(@Param('id') id: string, @Body() updateRentPaymentDto: UpdateRentPaymentDto): Promise<RentPayment> {
    return this.propertiesService.updateRentPayment(id, updateRentPaymentDto);
  }

}