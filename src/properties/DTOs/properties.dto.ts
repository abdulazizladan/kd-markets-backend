import { IsNotEmpty, IsEnum, IsOptional, IsString, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { BuildingStatus, ShopStatus } from '../enums/property-status.enum';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  town: string;

  @IsNotEmpty()
  @IsString()
  lga: string;

  @IsString()
  state: string; // The service will handle the default 'Kaduna'
}



export class UpdateAddressDto extends PartialType(CreateAddressDto) {}



export class CreateMarketDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}

export class UpdateMarketDto extends PartialType(CreateMarketDto) {}

export class CreateBuildingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsString()
  marketId: string; // To link to the parent Market
}

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {
  @IsOptional()
  @IsEnum(BuildingStatus)
  status?: BuildingStatus;
}


export class CreateStallDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  annualRentRate: number;

  @IsNotEmpty()
  @IsString()
  marketId: string; // To link to the parent Market

  @IsString()
  tenantId?: string; // Optional, as a stall can be vacant
}

export class UpdateStallDto extends PartialType(CreateStallDto) {
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @IsOptional()
  @IsString()
  tenantId?: string;
}

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  annualRentRate: number;

  @IsNotEmpty()
  @IsString()
  buildingId: string; // To link to the parent Building

  @IsString()
  tenantId?: string; // Optional, as a shop can be vacant
}

export class UpdateShopDto extends PartialType(CreateShopDto) {
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @IsOptional()
  @IsString()
  tenantId?: string;
}


export class CreateRentPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  shopId: string; // To link to the parent Shop

  @IsNotEmpty()
  @IsString()
  tenantId: string; // To link to the Tenant
}

export class UpdateRentPaymentDto extends PartialType(CreateRentPaymentDto) {}
