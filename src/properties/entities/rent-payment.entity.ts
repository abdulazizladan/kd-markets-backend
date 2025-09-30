import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Shop } from './shop.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

/**
 * Defines a single unpaid payment for a shop.
 * This entity tracks individual debts, which can then be summed.
 */
@Entity({name: 'RentPayment'})
export class RentPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  year: number;

  // A RentPayment belongs to one Shop
  @ManyToOne(() => Shop, (shop) => shop.rentPayments, { onDelete: 'CASCADE' })
  shop: Shop;

  // A RentPayment belongs to one Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.rentPayments)
  tenant: Tenant;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}