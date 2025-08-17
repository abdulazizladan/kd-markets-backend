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

import { ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('properties')
export class PropertiesController {

    constructor(private readonly propertiesService: PropertiesService) {}

    // --- Market Endpoints ---
  
  @Post('markets')
  @HttpCode(HttpStatus.CREATED)
  async createMarket(@Body() createMarketDto: CreateMarketDto): Promise<Market> {
    return this.propertiesService.createMarket(createMarketDto);
  }

  @Get('markets')
  async findAllMarkets(): Promise<Market[]> {
    return this.propertiesService.findAllMarkets();
  }

  @Get('markets/:id')
  async findOneMarket(@Param('id') id: string): Promise<Market> {
    return this.propertiesService.findOneMarket(id);
  }

  @Patch('markets/:id')
  async updateMarket(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto): Promise<Market> {
    return this.propertiesService.updateMarket(id, updateMarketDto);
  }

  @Delete('markets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMarket(@Param('id') id: string): Promise<void> {
    return this.propertiesService.deleteMarket(id);
  }

  // --- Building Endpoints ---

  @Post('buildings')
  @HttpCode(HttpStatus.CREATED)
  async createBuilding(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
    return this.propertiesService.createBuilding(createBuildingDto);
  }

  @Get('buildings/:id')
  async findOneBuilding(@Param('id') id: string): Promise<Building> {
    return this.propertiesService.findOneBuilding(id);
  }

  @Patch('buildings/:id')
  async updateBuilding(@Param('id') id: string, @Body() updateBuildingDto: UpdateBuildingDto): Promise<Building> {
    return this.propertiesService.updateBuilding(id, updateBuildingDto);
  }

  // --- Stall Endpoints ---
  
  /**@Post('stalls')
  @HttpCode(HttpStatus.CREATED)
  async createStall(@Body() createStallDto: CreateStallDto): Promise<Stall> {
    return this.propertiesService.createStall(createStallDto);
  }**/

  @Get('stalls/:id')
  async findOneStall(@Param('id') id: string): Promise<Stall> {
    return this.propertiesService.findOneStall(id);
  }

  @Patch('stalls/:id')
  async updateStall(@Param('id') id: string, @Body() updateStallDto: UpdateStallDto): Promise<Stall> {
    return this.propertiesService.updateStall(id, updateStallDto);
  }

  // --- Shop Endpoints ---
  
  @Post('shops')
  @HttpCode(HttpStatus.CREATED)
  async createShop(@Body() createShopDto: CreateShopDto): Promise<Shop> {
    return this.propertiesService.createShop(createShopDto);
  }

  @Get('shops/:id')
  async findOneShop(@Param('id') id: string): Promise<Shop> {
    return this.propertiesService.findOneShop(id);
  }

  @Patch('shops/:id')
  async updateShop(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto): Promise<Shop> {
    return this.propertiesService.updateShop(id, updateShopDto);
  }

  // --- Rent Payment Endpoints ---

  @Post('rent-payments')
  @HttpCode(HttpStatus.CREATED)
  async createRentPayment(@Body() createRentPaymentDto: CreateRentPaymentDto): Promise<RentPayment> {
    return this.propertiesService.createRentPayment(createRentPaymentDto);
  }

  @Get('rent-payments/:id')
  async findOneRentPayment(@Param('id') id: string): Promise<RentPayment> {
    return this.propertiesService.findOneRentPayment(id);
  }

  @Patch('rent-payments/:id')
  async updateRentPayment(@Param('id') id: string, @Body() updateRentPaymentDto: UpdateRentPaymentDto): Promise<RentPayment> {
    return this.propertiesService.updateRentPayment(id, updateRentPaymentDto);
  }

}
