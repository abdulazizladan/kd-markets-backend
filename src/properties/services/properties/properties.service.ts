import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from '../../entities/market.entity';
import { Building } from '../../entities/building.entity';
import { Stall } from '../../entities/stall.entity';
import { Shop } from '../../entities/shop.entity';
import { RentPayment } from '../../entities/rent-payment.entity';
import { Address } from '../../entities/address.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';
import { ShopStatus } from '../../enums/property-status.enum';

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
        'stalls',
        'stalls.tenant' // so a market page can show who occupies each stall
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
        'stalls',
        'stalls.tenant' // so a market page can show who occupies each stall
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
      // Each shop comes with its tenant so a building page can show who occupies it
      relations: ['market', 'shops', 'shops.tenant'] 
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

    const { tenantId, marketId, occupancyStartDate, tenancyExpiryDate, paymentStatus, ...details } = createStallDto;

    const newStall = this.stallRepository.create({
      ...details,
      market,
      tenant,
      status: tenant ? ShopStatus.OCCUPIED : ShopStatus.VACANT,
      // Tenancy details only mean something while a tenant occupies the stall
      occupancyStartDate: tenant ? occupancyStartDate ?? null : null,
      tenancyExpiryDate: tenant ? tenancyExpiryDate ?? null : null,
      paymentStatus: tenant ? paymentStatus ?? null : null,
    });

    return this.stallRepository.save(newStall);
  }

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
    await this.applyUnitUpdate(stall, updateStallDto);
    await this.stallRepository.save(stall);
    return this.findOneStall(id);
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

    const { tenantId, buildingId, occupancyStartDate, tenancyExpiryDate, paymentStatus, ...details } = createShopDto;

    const newShop = this.shopRepository.create({
      ...details,
      building,
      tenant,
      status: tenant ? ShopStatus.OCCUPIED : ShopStatus.VACANT,
      // Tenancy details only mean something while a tenant occupies the shop
      occupancyStartDate: tenant ? occupancyStartDate ?? null : null,
      tenancyExpiryDate: tenant ? tenancyExpiryDate ?? null : null,
      paymentStatus: tenant ? paymentStatus ?? null : null,
    });

    return this.shopRepository.save(newShop);
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
    await this.applyUnitUpdate(shop, updateShopDto);

    await this.shopRepository.save(shop);
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

  // --- Tenancy rules shared by Shops and Stalls ---

  /**
   * Applies an update to a shop or a stall. Both follow the same tenancy rules:
   * only the fields that were sent change, `tenantId: null` vacates the unit and
   * clears its tenancy, and the status follows from whether there is a tenant.
   * The caller saves the entity.
   */
  private async applyUnitUpdate(unit: Shop | Stall, update: UpdateShopDto | UpdateStallDto): Promise<void> {
    // `status` is derived below, and a unit does not move to another building or market
    const { tenantId, status, buildingId, marketId, ...details } = update as UpdateShopDto & UpdateStallDto;

    for (const [field, value] of Object.entries(details)) {
      if (value !== undefined) {
        unit[field] = value;
      }
    }

    if (tenantId === null) {
      // Vacating the unit ends the tenancy
      unit.tenant = null;
      unit.occupancyStartDate = null;
      unit.tenancyExpiryDate = null;
      unit.paymentStatus = null;
    } else if (tenantId) {
      const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
      }
      unit.tenant = tenant;
    }

    unit.status = unit.tenant ? ShopStatus.OCCUPIED : ShopStatus.VACANT;
  }

  // --- Rent Payment Service Methods ---

  /**
   * Creates a new RentPayment.
   * @param createRentPaymentDto The DTO containing rent payment details.
   * @returns The newly created RentPayment entity.
   * @throws NotFoundException if the parent shop or tenant is not found.
   */
  async createRentPayment(createRentPaymentDto: CreateRentPaymentDto): Promise<RentPayment> {
    const { shopId, stallId, tenantId, paymentStatus, amount, paymentDate, year } = createRentPaymentDto;

    if ((shopId && stallId) || (!shopId && !stallId)) {
      throw new BadRequestException('A payment must be for one shop or one stall');
    }

    // Find the unit that was paid for, and the market it is in
    let shop: Shop | null = null;
    let stall: Stall | null = null;
    let market: Market;
    if (shopId) {
      shop = await this.shopRepository.findOne({
        where: { id: shopId },
        relations: ['tenant', 'building', 'building.market'],
      });
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${shopId} not found`);
      }
      market = shop.building.market;
    } else {
      stall = await this.stallRepository.findOne({ where: { id: stallId }, relations: ['tenant', 'market'] });
      if (!stall) {
        throw new NotFoundException(`Stall with ID ${stallId} not found`);
      }
      market = stall.market;
    }
    const unit = (shop ?? stall) as Shop | Stall;

    // The payer is the tenant occupying the unit unless another is named
    let tenant: Tenant | null = unit.tenant;
    if (tenantId) {
      tenant = await this.tenantRepository.findOneBy({ id: tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
      }
    }

    const newPayment = this.rentPaymentRepository.create({
      amount,
      paymentDate,
      year: year ?? paymentDate.getFullYear(),
      market,
      shop,
      stall,
      tenant,
    });
    const saved = await this.rentPaymentRepository.save(newPayment);

    // Recording a payment can settle the tenancy in the same step
    if (paymentStatus) {
      unit.paymentStatus = paymentStatus;
      if (shop) {
        await this.shopRepository.save(shop);
      } else if (stall) {
        await this.stallRepository.save(stall);
      }
    }

    return this.findOneRentPayment(saved.id);
  }

  /**
   * Fetches every payment received for the shops and stalls of a market,
   * newest first. This is the market's revenue.
   * @param marketId The ID of the market.
   * @throws NotFoundException if the market is not found.
   */
  async findMarketRentPayments(marketId: string): Promise<RentPayment[]> {
    const market = await this.marketRepository.findOneBy({ id: marketId });
    if (!market) {
      throw new NotFoundException(`Market with ID ${marketId} not found`);
    }
    return this.rentPaymentRepository.find({
      where: { market: { id: marketId } },
      relations: ['shop', 'stall', 'tenant'],
      order: { paymentDate: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Fetches all RentPayments for a specific shop.
   * @param shopId The ID of the shop.
   * @returns An array of RentPayment entities.
   */
  async findAllRentPayments(shopId: string): Promise<RentPayment[]> {
    return this.rentPaymentRepository.find({ 
      where: { shop: { id: shopId } },
      relations: ['shop', 'stall', 'tenant'] 
    });
  }

  /**
   * Fetches a single RentPayment by its ID.
   * @param id The ID of the rent payment to fetch.
   * @returns The RentPayment entity.
   * @throws NotFoundException if the rent payment is not found.
   */
  async findOneRentPayment(id: string): Promise<RentPayment> {
    const payment = await this.rentPaymentRepository.findOne({ 
      where: { id }, 
      relations: ['shop', 'stall', 'tenant'] 
    });
    if (!payment) {
      throw new NotFoundException(`Rent Payment with ID ${id} not found`);
    }
    return payment;
  }

  /**
   * Corrects the amount, date or year of a recorded payment.
   * @param id The ID of the rent payment to update.
   * @param updateRentPaymentDto The DTO containing the corrections.
   * @returns The updated RentPayment entity.
   * @throws NotFoundException if the rent payment is not found.
   */
  async updateRentPayment(id: string, updateRentPaymentDto: UpdateRentPaymentDto): Promise<RentPayment> {
    const payment = await this.findOneRentPayment(id);
    for (const [field, value] of Object.entries(updateRentPaymentDto)) {
      if (value !== undefined) {
        payment[field] = value;
      }
    }
    await this.rentPaymentRepository.save(payment);
    return this.findOneRentPayment(id);
  }

  /**
   * Deletes a RentPayment by its ID, for example one recorded by mistake.
   * @param id The ID of the rent payment to delete.
   * @throws NotFoundException if the rent payment is not found.
   */
  async deleteRentPayment(id: string): Promise<void> {
    const payment = await this.findOneRentPayment(id);
    await this.rentPaymentRepository.remove(payment);
  }
}
