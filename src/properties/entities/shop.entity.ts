import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Building } from './building.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { RentPayment } from './rent-payment.entity';
import { ShopStatus } from '../enums/property-status.enum';
import { Maintence } from 'src/maintenance/entities/maintenance.entity';

/**
 * Defines the Shop entity, which is located inside a Building.
 */
@Entity({name: 'Shop'})
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  annualRentRate: number;

  @Column({
    default: ShopStatus.VACANT,
  })
  status: string;

  // A Shop can have one Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.shops, {
    nullable: true, // A shop can be vacant (have no tenant)
  })
  tenant: Tenant;

  @Column({})
  size: string;

  // A Shop belongs to one Building
  @ManyToOne(() => Building, (building) => building.shops, { onDelete: 'CASCADE' })
  building: Building;

  // A Shop can have many unpaid RentPayments
  @OneToMany((type) => RentPayment, (rentPayment) => rentPayment.shop)
  rentPayments: RentPayment[];

  //@ManyToOne((type) => Maintence, maintenance => maintenance.shops)
  //maintenance: Maintence;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}