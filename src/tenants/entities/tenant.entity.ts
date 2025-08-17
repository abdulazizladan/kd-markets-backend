import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shop } from '../../properties/entities/shop.entity';
import { Stall } from '../../properties/entities/stall.entity';
import { RentPayment } from '../../properties/entities/rent-payment.entity';

/**
 * Defines the Tenant entity. This is necessary to correctly link to Shops and Stalls.
 */
@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  contactNumber: string;

  // A Tenant can have many Shops
  @OneToMany(() => Shop, (shop) => shop.tenant)
  shops: Shop[];

  // A Tenant can also have many Stalls
  @OneToMany(() => Stall, (stall) => stall.tenant)
  stalls: Stall[];

  // A Tenant can have many unpaid RentPayments
  @OneToMany(() => RentPayment, (rentPayment) => rentPayment.tenant)
  rentPayments: RentPayment[];
}