import { IsNotEmpty, IsEnum, IsOptional, IsString, IsObject, ValidateNested, IsNumber, IsArray, IsDate, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { BuildingStatus, PaymentStatus, ShopStatus } from '../enums/property-status.enum';
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
    description: "Annual rent for the stall, in Naira"
  })
  @IsNumber()
  @Min(0)
  annualRentRate: number;

  @ApiProperty({
    description: "Market ID"
  })
  @IsNotEmpty()
  @IsString()
  marketId: string; // To link to the parent Market

  @ApiProperty({ required: false, description: 'Size of the stall, for example "2m x 2m"' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ required: false, nullable: true, description: 'Tenant occupying the stall. Leave out for a vacant stall.' })
  @IsOptional()
  @IsString()
  tenantId?: string | null; // Optional, as a stall can be vacant

  // The tenancy fields below follow the same rules as a shop's.

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date', description: 'The day the tenant moved in' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occupancyStartDate?: Date | null;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date', description: 'The day the tenancy ends' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tenancyExpiryDate?: Date | null;

  @ApiProperty({ required: false, nullable: true, enum: PaymentStatus, description: 'Whether the rent for the current tenancy has been paid' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus | null;
}

/**
 * Every field is optional. Send `tenantId: null` to vacate the stall, which
 * also clears the tenancy dates and payment status.
 */
export class UpdateStallDto extends PartialType(CreateStallDto) {

  @ApiProperty({ required: false, description: 'Ignored: the status follows from whether the stall has a tenant' })
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;
}

export class CreateShopDto {

  @ApiProperty({ description: 'Name or number of the shop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Annual rent for the shop, in Naira' })
  @IsNumber()
  @Min(0)
  annualRentRate: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  buildingId: string; // To link to the parent Building

  @ApiProperty({ required: false, description: 'Size of the shop, for example "3m x 4m"' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ required: false, nullable: true, description: 'Tenant occupying the shop. Leave out for a vacant shop.' })
  @IsOptional()
  @IsString()
  tenantId?: string | null; // Optional, as a shop can be vacant

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date', description: 'The day the tenant moved in' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occupancyStartDate?: Date | null;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date', description: 'The day the tenancy ends' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tenancyExpiryDate?: Date | null;

  @ApiProperty({ required: false, nullable: true, enum: PaymentStatus, description: 'Whether the rent for the current tenancy has been paid' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus | null;
}

/**
 * Every field is optional. Send `tenantId: null` to vacate the shop, which
 * also clears the tenancy dates and payment status.
 */
export class UpdateShopDto extends PartialType(CreateShopDto) {

  @ApiProperty({ required: false, description: 'Ignored: the status follows from whether the shop has a tenant' })
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;
}


export class CreateRentPaymentDto {

  @ApiProperty({ description: 'Amount received, in Naira' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ type: String, format: 'date', description: 'The day the money was received' })
  @Type(() => Date)
  @IsDate()
  paymentDate: Date;

  @ApiProperty({ required: false, description: 'The shop the payment is for. Send this or stallId, not both.' })
  @IsOptional()
  @IsString()
  shopId?: string;

  @ApiProperty({ required: false, description: 'The stall the payment is for. Send this or shopId, not both.' })
  @IsOptional()
  @IsString()
  stallId?: string;

  @ApiProperty({ required: false, description: 'The tenant who paid. Defaults to the tenant occupying the unit.' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ required: false, description: 'The rent year the payment is for. Defaults to the year of the payment date.' })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ required: false, enum: PaymentStatus, description: "If sent, the unit's tenancy payment status is set to this at the same time" })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}

/** Only the amount, date and year of a recorded payment can be corrected. */
export class UpdateRentPaymentDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiProperty({ required: false, type: String, format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paymentDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  year?: number;
}
