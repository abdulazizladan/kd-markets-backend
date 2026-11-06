import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Market } from './market.entity';
import { Shop } from './shop.entity';
import { Stall } from './stall.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

/**
 * A rent payment received for a shop or a stall.
 * A market's revenue is the sum of these.
 */
@Entity({name: 'RentPayment'})
export class RentPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Amount received, in Naira
  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  // The day the money was received
  @Column({ type: 'date', nullable: true })
  paymentDate: Date;

  // The rent year the payment is for. Defaults to the year of the payment date.
  @Column()
  year: number;

  // The market the paid-for unit is in. Stored directly so revenue can be
  // listed per market whether the unit is a shop or a stall.
  @ManyToOne(() => Market, { nullable: true, onDelete: 'CASCADE' })
  market: Market;

  // A payment is for either a Shop...
  @ManyToOne(() => Shop, (shop) => shop.rentPayments, { nullable: true, onDelete: 'CASCADE' })
  shop: Shop | null;

  // ...or a Stall
  @ManyToOne(() => Stall, { nullable: true, onDelete: 'CASCADE' })
  stall: Stall | null;

  // The tenant who paid
  @ManyToOne(() => Tenant, (tenant) => tenant.rentPayments, { nullable: true })
  tenant: Tenant | null;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}
