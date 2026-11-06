import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Market } from './market.entity';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { Maintence } from 'src/maintenance/entities/maintenance.entity';

/**
 * Defines the Stall entity, which is part of a Market but not a Building.
 */
@Entity({name: 'Stall'})
export class Stall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  annualRentRate: number;

  @Column({
    default: 'vacant',
  })
  status: string; // 'occupied' | 'vacant', see ShopStatus

  // A Stall can have one Tenant. Note: The prompt didn't specify this, but it's logical.
  @ManyToOne(() => Tenant, (tenant) => tenant.stalls, {
    nullable: true, // A stall can be vacant
  })
  tenant: Tenant | null;

  @Column({ type: 'varchar', nullable: true })
  size: string | null;

  // --- Current tenancy, with the same rules as a Shop. Only set while a tenant occupies the stall. ---

  // The day the current tenant moved in
  @Column({ type: 'date', nullable: true })
  occupancyStartDate: Date | null;

  // The day the current tenancy ends
  @Column({ type: 'date', nullable: true })
  tenancyExpiryDate: Date | null;

  // Whether the rent for the current tenancy has been paid: see PaymentStatus
  @Column({ type: 'varchar', nullable: true })
  paymentStatus: string | null;

  // A Stall belongs to one Market
  @ManyToOne(() => Market, (market) => market.stalls, { onDelete: 'CASCADE' })
  market: Market;

  //@ManyToOne((type) => Maintence, maintenance => maintenance.stall)
  //maintenance: Maintence;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}