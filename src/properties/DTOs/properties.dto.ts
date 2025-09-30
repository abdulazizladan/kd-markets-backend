import { IsNotEmpty, IsEnum, IsOptional, IsString, IsObject, ValidateNested, IsNumber, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { BuildingStatus, ShopStatus } from '../enums/property-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {

  @ApiProperty({
    description: "street address or description of the market's location"
  })
  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @ApiProperty({
    description: "Town the market is located"
  })
  @IsNotEmpty()
  @IsString()
  town: string;

  @ApiProperty({
    description: "LGA the market is located"
  })
  @IsNotEmpty()
  @IsString()
  lga: string;

  @ApiProperty({
    description: "State the market is located"
  })
  @IsString()
  state: string; // The service will handle the default 'Kaduna'
}



export class UpdateAddressDto extends PartialType(CreateAddressDto) {}



export class CreateMarketDto {

  @ApiProperty({
    description: "Name of the market"
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Address of the market",
    type: CreateAddressDto
  })
 
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({nullable: true, description: 'Buildings details', isArray: true})
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBuildingDto)
  buildings: CreateBuildingDto[]

  @ApiProperty({nullable: true, description: 'Stalls details', isArray: true})
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStallDto)
  stalls: CreateStallDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;
}

export class UpdateMarketDto extends PartialType(CreateMarketDto) {

  @ApiProperty({ required: false, description: 'Status of the market' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateBuildingDto {

  @ApiProperty({
    description: "Name or code of the building"
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "A brief description of the market"
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Any additional description of the state and status of the building"
  })
  @IsNotEmpty()
  @IsString()
  summary: string;

  @ApiProperty({
    description: "ID off the market in which the building is located"
  })
  @IsNotEmpty()
  @IsString()
  marketId: string; // To link to the parent Market
}

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {

  @ApiProperty({
    description: "Status of the building"
  })
  @IsOptional()
  @IsEnum(BuildingStatus)
  status?: BuildingStatus;
}


export class CreateStallDto {

  @ApiProperty({
    description: "Name or code of the stall"
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Annual rent rate in NGR"
  })
  @IsNotEmpty()
  @IsNumber()
  annualRentRate: number;

  @ApiProperty({
    description: "Market ID"
  })
  @IsNotEmpty()
  @IsString()
  marketId: string; // To link to the parent Market

  @ApiProperty({
    description: "Tenant ID"
  })
  @IsString()
  tenantId?: string; // Optional, as a stall can be vacant
}

export class UpdateStallDto extends PartialType(CreateStallDto) {

  @ApiProperty({
    description: "Status of the stall"
  })
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @ApiProperty({
    description: "Tenant ID"
  })
  @IsOptional()
  @IsString()
  tenantId?: string;
}

export class CreateShopDto {

  @ApiProperty({
    
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  annualRentRate: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  buildingId: string; // To link to the parent Building

  @ApiProperty({})
  @IsString()
  tenantId?: string; // Optional, as a shop can be vacant
}

export class UpdateShopDto extends PartialType(CreateShopDto) {

  @ApiProperty({})
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  tenantId?: string;
}


export class CreateRentPaymentDto {

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  shopId: string; // To link to the parent Shop

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  tenantId: string; // To link to the Tenant
}

export class UpdateRentPaymentDto extends PartialType(CreateRentPaymentDto) {}
