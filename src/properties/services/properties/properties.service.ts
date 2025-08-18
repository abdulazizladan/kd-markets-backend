import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from '../../entities/market.entity';
import { Building } from '../../entities/building.entity';
import { Stall } from '../../entities/stall.entity';
import { Shop } from '../../entities/shop.entity';
import { RentPayment } from '../../entities/rent-payment.entity';
import { Address } from '../../entities/address.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

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

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Stall)
    private readonly stallRepository: Repository<Stall>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(RentPayment)
    private readonly rentPaymentRepository: Repository<RentPayment>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * Creates a new Market and its associated Address.
   * @param createMarketDto The DTO containing market details.
   * @returns The newly created Market entity.
   */
  async createMarket(createMarketDto: CreateMarketDto): Promise<Market> {
    const { address, ...marketDetails } = createMarketDto;
    // Create and save the Address first due to the @OneToOne relationship
    const newAddress = this.addressRepository.create(address);
    const savedAddress = await this.addressRepository.save(newAddress);

    const newMarket = this.marketRepository.create({
      ...marketDetails,
      address: savedAddress,
    });
    return this.marketRepository.save(newMarket);
  }

  /**
   * Fetches all Markets from the database.
   * @returns An array of Market entities.
   */
  async findAllMarkets(): Promise<Market[]> {
    return this.marketRepository.find({ 
      relations: [
        'address', 
        'buildings', 
        'stalls'
      ] 
    });
  }

  /**
   * Fetches a single Market by its ID.
   * @param id The ID of the market to fetch.
   * @returns The Market entity.
   * @throws NotFoundException if the market is not found.
   */
  async findOneMarket(id: string): Promise<Market> {
    const market = await this.marketRepository.findOne({
      where: { id },
      relations: [
        'address', 
        'buildings', 
        'stalls'
      ],
    });
    if (!market) {
      throw new NotFoundException(`Market with ID ${id} not found`);
    }
    return market;
  }

  /**
   * Updates an existing Market.
   * @param id The ID of the market to update.
   * @param updateMarketDto The DTO containing the update details.
   * @returns The updated Market entity.
   * @throws NotFoundException if the market is not found.
   */
  async updateMarket(id: string, updateMarketDto: UpdateMarketDto): Promise<Market> {
    const market = await this.findOneMarket(id);

    if (updateMarketDto.address) {
      // Update the associated Address entity
      await this.addressRepository.update(market.address.id, updateMarketDto.address);
    }

    const { address, ...marketData } = updateMarketDto;
    await this.marketRepository.update(id, marketData);
    return this.findOneMarket(id); // Return the updated entity
  }

  /**
   * Deletes a Market by its ID.
   * @param id The ID of the market to delete.
   * @returns A success message.
   * @throws NotFoundException if the market is not found.
   */
  async deleteMarket(id: string): Promise<void> {
    const market = await this.findOneMarket(id);
    await this.marketRepository.remove(market);
  }

  // --- Building Service Methods ---

  /**
   * Creates a new Building and links it to an existing Market.
   * @param createBuildingDto The DTO containing building details.
   * @returns The newly created Building entity.
   * @throws NotFoundException if the parent market is not found.
   */
  async createBuilding(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const market = await this.marketRepository.findOneBy({ id: createBuildingDto.marketId });
    if (!market) {
      throw new NotFoundException(`Market with ID ${createBuildingDto.marketId} not found`);
    }
    const newBuilding = this.buildingRepository.create({
      ...createBuildingDto,
      market,
    });
    return this.buildingRepository.save(newBuilding);
  }

  /**
   * Fetches all Buildings for a specific market.
   * @param marketId The ID of the market.
   * @returns An array of Building entities.
   */
  async findAllBuildings(marketId: string): Promise<Building[]> {
    return this.buildingRepository.find({ 
      where: { market: { id: marketId } },
      relations: ['market', 'shops'] 
    });
  }

  /**
   * Fetches a single Building by its ID.
   * @param id The ID of the building to fetch.
   * @returns The Building entity.
   * @throws NotFoundException if the building is not found.
   */
  async findOneBuilding(id: string): Promise<Building> {
    const building = await this.buildingRepository.findOne({ 
      where: { id }, 
      relations: ['market', 'shops'] 
    });
    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }
    return building;
  }

  /**
   * Updates an existing Building.
   * @param id The ID of the building to update.
   * @param updateBuildingDto The DTO containing the update details.
   * @returns The updated Building entity.
   * @throws NotFoundException if the building is not found.
   */
  async updateBuilding(id: string, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
    const building = await this.findOneBuilding(id);
    await this.buildingRepository.update(id, updateBuildingDto);
    return this.findOneBuilding(id);
  }

  /**
   * Deletes a Building by its ID.
   * @param id The ID of the building to delete.
   * @returns A success message.
   * @throws NotFoundException if the building is not found.
   */
  async deleteBuilding(id: string): Promise<void> {
    const building = await this.findOneBuilding(id);
    await this.buildingRepository.remove(building);
  }

  // --- Stall Service Methods ---

  /**
   * Creates a new Stall and links it to an existing Market and an optional Tenant.
   * @param createStallDto The DTO containing stall details.
   * @returns The newly created Stall entity.
   * @throws NotFoundException if the parent market or tenant is not found.
   */
  /**
  async createStall(createStallDto: CreateStallDto): Promise<Stall> {
    const market = await this.marketRepository.findOneBy({ id: createStallDto.marketId });
    if (!market) {
      throw new NotFoundException(`Market with ID ${createStallDto.marketId} not found`);
    }

    let tenant: Tenant | null = null;
    if (createStallDto.tenantId) {
      tenant = await this.tenantRepository.findOneBy({ id: createStallDto.tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${createStallDto.tenantId} not found`);
      }
    }

    const newStall: Stall = this.stallRepository.create({
      ...createStallDto,
      market,
      tenant, // or tenant: tenant || undefined
      status: tenant ? 'occupied' : 'vacant' as const,
    });

    return this.stallRepository.save(newStall);
}**/

  /**
   * Fetches all Stalls for a specific market.
   * @param marketId The ID of the market.
   * @returns An array of Stall entities.
   */
  async findAllStalls(marketId: string): Promise<Stall[]> {
    return this.stallRepository.find({ 
      where: { market: { id: marketId } },
      relations: ['market', 'tenant'] 
    });
  }

  /**
   * Fetches a single Stall by its ID.
   * @param id The ID of the stall to fetch.
   * @returns The Stall entity.
   * @throws NotFoundException if the stall is not found.
   */
  async findOneStall(id: string): Promise<Stall> {
    const stall = await this.stallRepository.findOne({ 
      where: { id }, 
      relations: ['market', 'tenant'] 
    });
    if (!stall) {
      throw new NotFoundException(`Stall with ID ${id} not found`);
    }
    return stall;
  }

  /**
   * Updates an existing Stall.
   * @param id The ID of the stall to update.
   * @param updateStallDto The DTO containing the update details.
   * @returns The updated Stall entity.
   * @throws NotFoundException if the stall or tenant is not found.
   */
  async updateStall(id: string, updateStallDto: UpdateStallDto): Promise<Stall> {
    const stall = await this.findOneStall(id);

    let tenant: Tenant | undefined = stall.tenant || undefined;
    if (updateStallDto.tenantId) {
      const foundTenant = await this.tenantRepository.findOneBy({ id: updateStallDto.tenantId });
      if (!foundTenant) {
        throw new NotFoundException(`Tenant with ID ${updateStallDto.tenantId} not found`);
      }
      tenant = foundTenant;
    }

    // Create update object with explicit types
    const updateData = {
      ...updateStallDto,
      tenant,
      status: tenant ? 'occupied' : 'vacant' as const, // Cast to literal type
    };

    // Apply updates directly to the existing entity
    Object.assign(stall, updateData);
    
    // Save the updated entity
    const updatedStall = await this.stallRepository.save(stall);
    return updatedStall;
}

  /**
   * Deletes a Stall by its ID.
   * @param id The ID of the stall to delete.
   * @returns A success message.
   * @throws NotFoundException if the stall is not found.
   */
  async deleteStall(id: string): Promise<void> {
    const stall = await this.findOneStall(id);
    await this.stallRepository.remove(stall);
  }

  // --- Shop Service Methods ---

  /**
   * Creates a new Shop and links it to an existing Building and an optional Tenant.
   * @param createShopDto The DTO containing shop details.
   * @returns The newly created Shop entity.
   * @throws NotFoundException if the parent building or tenant is not found.
   */
  async createShop(createShopDto: CreateShopDto): Promise<Shop> {
    const building = await this.buildingRepository.findOneBy({ id: createShopDto.buildingId });
    if (!building) {
      throw new NotFoundException(`Building with ID ${createShopDto.buildingId} not found`);
    }

    let tenant: Tenant | null = null;
    if (createShopDto.tenantId) {
      tenant = await this.tenantRepository.findOneBy({ id: createShopDto.tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${createShopDto.tenantId} not found`);
      }
    }

    const newShop = this.shopRepository.create({
      ...createShopDto,
      building,
      tenant: tenant || undefined, // Use undefined instead of null if tenant is null
      status: tenant ? 'occupied' : 'vacant',
    });

    // Explicitly type the result as Shop
    const savedShop = await this.shopRepository.save(newShop) as Shop;
    return savedShop;
    }

  /**
   * Fetches all Shops for a specific building.
   * @param buildingId The ID of the building.
   * @returns An array of Shop entities.
   */
  async findAllShops(buildingId: string): Promise<Shop[]> {
    return this.shopRepository.find({ 
      where: { building: { id: buildingId } },
      relations: ['building', 'tenant'] 
    });
  }

  /**
   * Fetches a single Shop by its ID.
   * @param id The ID of the shop to fetch.
   * @returns The Shop entity.
   * @throws NotFoundException if the shop is not found.
   */
  async findOneShop(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({ 
      where: { id }, 
      relations: ['building', 'tenant'] 
    });
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    return shop;
  }

  /**
   * Updates an existing Shop.
   * @param id The ID of the shop to update.
   * @param updateShopDto The DTO containing the update details.
   * @returns The updated Shop entity.
   * @throws NotFoundException if the shop or tenant is not found.
   */
  async updateShop(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const shop = await this.findOneShop(id);

    let tenant: Tenant | null = shop.tenant;
    if (updateShopDto.tenantId) {
      tenant = await this.tenantRepository.findOneBy({ id: updateShopDto.tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${updateShopDto.tenantId} not found`);
      }
    }

    const updatedShop = {
      ...shop,
      ...updateShopDto,
      tenant,
      status: tenant ? 'occupied' : 'vacant',
    };

    await this.shopRepository.save(updatedShop);
    return this.findOneShop(id);
  }

  /**
   * Deletes a Shop by its ID.
   * @param id The ID of the shop to delete.
   * @returns A success message.
   * @throws NotFoundException if the shop is not found.
   */
  async deleteShop(id: string): Promise<void> {
    const shop = await this.findOneShop(id);
    await this.shopRepository.remove(shop);
  }

  // --- Rent Payment Service Methods ---

  /**
   * Creates a new RentPayment.
   * @param createRentPaymentDto The DTO containing rent payment details.
   * @returns The newly created RentPayment entity.
   * @throws NotFoundException if the parent shop or tenant is not found.
   */
  async createRentPayment(createRentPaymentDto: CreateRentPaymentDto): Promise<RentPayment> {
    const shop = await this.shopRepository.findOneBy({ id: createRentPaymentDto.shopId });
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${createRentPaymentDto.shopId} not found`);
    }

    const tenant = await this.tenantRepository.findOneBy({ id: createRentPaymentDto.tenantId });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${createRentPaymentDto.tenantId} not found`);
    }

    const newPayment = this.rentPaymentRepository.create({
      ...createRentPaymentDto,
      shop,
      tenant,
    });
    return this.rentPaymentRepository.save(newPayment);
  }

  /**
   * Fetches all RentPayments for a specific shop.
   * @param shopId The ID of the shop.
   * @returns An array of RentPayment entities.
   */
  async findAllRentPayments(shopId: string): Promise<RentPayment[]> {
    return this.rentPaymentRepository.find({ 
      where: { shop: { id: shopId } },
      relations: ['shop', 'tenant'] 
    });
  }

  /**
   * Fetches a single RentPayment by its ID.
   * @param id The ID of the payment to fetch.
   * @returns The RentPayment entity.
   * @throws NotFoundException if the payment is not found.
   */
  async findOneRentPayment(id: string): Promise<RentPayment> {
    const payment = await this.rentPaymentRepository.findOne({ 
      where: { id }, 
      relations: ['shop', 'tenant'] 
    });
    if (!payment) {
      throw new NotFoundException(`Rent Payment with ID ${id} not found`);
    }
    return payment;
  }

  /**
   * Updates an existing RentPayment.
   * @param id The ID of the payment to update.
   * @param updateRentPaymentDto The DTO containing the update details.
   * @returns The updated RentPayment entity.
   * @throws NotFoundException if the payment is not found.
   */
  async updateRentPayment(id: string, updateRentPaymentDto: UpdateRentPaymentDto): Promise<RentPayment> {
    const payment = await this.findOneRentPayment(id);
    await this.rentPaymentRepository.update(id, updateRentPaymentDto);
    return this.findOneRentPayment(id);
  }

  /**
   * Deletes a RentPayment by its ID.
   * @param id The ID of the payment to delete.
   * @returns A success message.
   * @throws NotFoundException if the payment is not found.
   */
  async deleteRentPayment(id: string): Promise<void> {
    const payment = await this.findOneRentPayment(id);
    await this.rentPaymentRepository.remove(payment);
  }
}