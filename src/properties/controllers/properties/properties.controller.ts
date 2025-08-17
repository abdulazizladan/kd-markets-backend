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

import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('properties')
export class PropertiesController {

    constructor(private readonly propertiesService: PropertiesService) {}

    // --- Market Endpoints ---
  
  @ApiTags('Markets')
  @ApiOperation({ summary: 'Create a new market' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The market has been successfully created.', type: Market })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @Post('markets')
  @HttpCode(HttpStatus.CREATED)
  async createMarket(@Body() createMarketDto: CreateMarketDto): Promise<Market> {
    return this.propertiesService.createMarket(createMarketDto);
  }

  @ApiTags('Markets')
  @ApiOperation({ summary: 'Retrieve all markets' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all markets.', type: [Market] })
  @Get('markets')
  async findAllMarkets(): Promise<Market[]> {
    return this.propertiesService.findAllMarkets();
  }

  @ApiTags('Markets')
  @ApiOperation({ summary: 'Retrieve a single market by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the market', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the market.', type: Market })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Market not found.' })
  @Get('markets/:id')
  async findOneMarket(@Param('id') id: string): Promise<Market> {
    return this.propertiesService.findOneMarket(id);
  }

  @ApiTags('Markets')
  @ApiOperation({ summary: 'Update an existing market' })
  @ApiParam({ name: 'id', description: 'The ID of the market to update', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The market has been successfully updated.', type: Market })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Market not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @Patch('markets/:id')
  async updateMarket(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto): Promise<Market> {
    return this.propertiesService.updateMarket(id, updateMarketDto);
  }

  @ApiTags('Markets')
  @ApiOperation({ summary: 'Delete a market by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the market to delete', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The market has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Market not found.' })
  @Delete('markets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMarket(@Param('id') id: string): Promise<void> {
    return this.propertiesService.deleteMarket(id);
  }

  // --- Building Endpoints ---

  @ApiTags('Buildings')
  @ApiOperation({ summary: 'Create a new building' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The building has been successfully created.', type: Building })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent market not found.' })
  @Post('buildings')
  @HttpCode(HttpStatus.CREATED)
  async createBuilding(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
    return this.propertiesService.createBuilding(createBuildingDto);
  }

  @ApiTags('Buildings')
  @ApiOperation({ summary: 'Retrieve a single building by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the building', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the building.', type: Building })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Building not found.' })
  @Get('buildings/:id')
  async findOneBuilding(@Param('id') id: string): Promise<Building> {
    return this.propertiesService.findOneBuilding(id);
  }

  @ApiTags('Buildings')
  @ApiOperation({ summary: 'Update an existing building' })
  @ApiParam({ name: 'id', description: 'The ID of the building to update', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The building has been successfully updated.', type: Building })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Building not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @Patch('buildings/:id')
  async updateBuilding(@Param('id') id: string, @Body() updateBuildingDto: UpdateBuildingDto): Promise<Building> {
    return this.propertiesService.updateBuilding(id, updateBuildingDto);
  }

  // --- Stall Endpoints ---
  
 /**  @ApiTags('Stalls')
  @ApiOperation({ summary: 'Create a new stall' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The stall has been successfully created.', type: Stall })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent market or tenant not found.' })
  @Post('stalls')
  @HttpCode(HttpStatus.CREATED)
  async createStall(@Body() createStallDto: CreateStallDto): Promise<Stall> {
    return this.propertiesService.createStall(createStallDto);
  } **/

  @ApiTags('Stalls')
  @ApiOperation({ summary: 'Retrieve a single stall by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the stall', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the stall.', type: Stall })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Stall not found.' })
  @Get('stalls/:id')
  async findOneStall(@Param('id') id: string): Promise<Stall> {
    return this.propertiesService.findOneStall(id);
  }

  @ApiTags('Stalls')
  @ApiOperation({ summary: 'Update an existing stall' })
  @ApiParam({ name: 'id', description: 'The ID of the stall to update', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The stall has been successfully updated.', type: Stall })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Stall or tenant not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @Patch('stalls/:id')
  async updateStall(@Param('id') id: string, @Body() updateStallDto: UpdateStallDto): Promise<Stall> {
    return this.propertiesService.updateStall(id, updateStallDto);
  }

  // --- Shop Endpoints ---
  
  @ApiTags('Shops')
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The shop has been successfully created.', type: Shop })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent building or tenant not found.' })
  @Post('shops')
  @HttpCode(HttpStatus.CREATED)
  async createShop(@Body() createShopDto: CreateShopDto): Promise<Shop> {
    return this.propertiesService.createShop(createShopDto);
  }

  @ApiTags('Shops')
  @ApiOperation({ summary: 'Retrieve a single shop by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the shop', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the shop.', type: Shop })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shop not found.' })
  @Get('shops/:id')
  async findOneShop(@Param('id') id: string): Promise<Shop> {
    return this.propertiesService.findOneShop(id);
  }

  @ApiTags('Shops')
  @ApiOperation({ summary: 'Update an existing shop' })
  @ApiParam({ name: 'id', description: 'The ID of the shop to update', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The shop has been successfully updated.', type: Shop })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shop or tenant not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @Patch('shops/:id')
  async updateShop(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto): Promise<Shop> {
    return this.propertiesService.updateShop(id, updateShopDto);
  }

  // --- Rent Payment Endpoints ---

  @ApiTags('Rent Payments')
  @ApiOperation({ summary: 'Create a new rent payment' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The rent payment has been successfully created.', type: RentPayment })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shop or tenant not found.' })
  @Post('rent-payments')
  @HttpCode(HttpStatus.CREATED)
  async createRentPayment(@Body() createRentPaymentDto: CreateRentPaymentDto): Promise<RentPayment> {
    return this.propertiesService.createRentPayment(createRentPaymentDto);
  }

  @ApiTags('Rent Payments')
  @ApiOperation({ summary: 'Retrieve a single rent payment by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the rent payment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the rent payment.', type: RentPayment })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rent payment not found.' })
  @Get('rent-payments/:id')
  async findOneRentPayment(@Param('id') id: string): Promise<RentPayment> {
    return this.propertiesService.findOneRentPayment(id);
  }

  @ApiTags('Rent Payments')
  @ApiOperation({ summary: 'Update an existing rent payment' })
  @ApiParam({ name: 'id', description: 'The ID of the rent payment to update', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The rent payment has been successfully updated.', type: RentPayment })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rent payment not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @Patch('rent-payments/:id')
  async updateRentPayment(@Param('id') id: string, @Body() updateRentPaymentDto: UpdateRentPaymentDto): Promise<RentPayment> {
    return this.propertiesService.updateRentPayment(id, updateRentPaymentDto);
  }

}