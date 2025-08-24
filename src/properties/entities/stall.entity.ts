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
  status: 'occupied' | 'vacant';

  // A Stall can have one Tenant. Note: The prompt didn't specify this, but it's logical.
  @ManyToOne(() => Tenant, (tenant) => tenant.stalls, {
    nullable: true, // A stall can be vacant
  })
  tenant: Tenant;

  // A Stall belongs to one Market
  @ManyToOne(() => Market, (market) => market.stalls)
  market: Market;

  //@ManyToOne((type) => Maintence, maintenance => maintenance.stall)
  //maintenance: Maintence;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}