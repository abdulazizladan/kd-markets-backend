import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTenantDto } from 'src/tenants/DTOs/create-tenant.dto';
import { UpdateTenantDto } from 'src/tenants/DTOs/update-tenant.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsService {

    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>
    ) {

    }

    /**
     * @returns a summary of 
     */
    async getStats(): Promise<any> {
        return
    }

    /**
   * Creates a new tenant in the database.
   * Handles potential database errors during the creation process.
   * @param createTenantDto The data transfer object for creating a tenant.
   * @returns The newly created tenant object.
   */
  async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
    try {
      const tenant = this.tenantRepository.create(createTenantDto);
      return await this.tenantRepository.save(tenant);
    } catch (error) {
      // You can add more specific error checks here if needed,
      // for example, to handle unique constraint violations.
      throw new InternalServerErrorException(
        'Failed to create tenant due to a server error.',
      );
    }
  }



  /**
   * Retrieves all tenants from the database.
   * @returns An array of all tenants.
   */
  async getAll(): Promise<Tenant[]> {
    try {
      return await this.tenantRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve tenants due to a server error.',
      );
    }
  }



  /**
   * Retrieves a single tenant by their ID.
   * Throws a NotFoundException if the tenant does not exist.
   * @param id The ID of the tenant to retrieve.
   * @returns The tenant object.
   */
  async getByID(id: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantRepository.findOne({ where: { id } });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${id} not found.`);
      }
      return tenant;
    } catch (error) {
      // Re-throw NotFoundException to be handled by NestJS
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Handle potential invalid UUID format or other errors
      throw new BadRequestException(
        'Invalid tenant ID or a server error occurred.',
      );
    }
  }


  /**
   * Updates an existing tenant.
   * Throws a NotFoundException if the tenant does not exist.
   * @param id The ID of the tenant to update.
   * @param updateTenantDto The data transfer object with updated tenant data.
   * @returns The updated tenant object.
   */
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    try {
      const tenant = await this.getByID(id); // Reuses the getByID method to check for existence
      const updatedTenant = this.tenantRepository.merge(tenant, updateTenantDto);
      return await this.tenantRepository.save(updatedTenant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the exception from getByID
      }
      // Handle other potential errors during save
      throw new InternalServerErrorException(
        `Failed to update tenant with ID ${id}.`,
      );
    }
  }



  /**
   * Removes a tenant from the database.
   * Throws a NotFoundException if the tenant does not exist.
   * @param id The ID of the tenant to remove.
   */
  async remove(id: string): Promise<void> {
    try {
      const tenant = await this.getByID(id); // Reuses the getByID method to check for existence
      await this.tenantRepository.remove(tenant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the exception from getByID
      }
      throw new InternalServerErrorException(
        `Failed to remove tenant with ID ${id}.`,
      );
    }
  }
}
