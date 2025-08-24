import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Shop } from '../../properties/entities/shop.entity';
import { Stall } from '../../properties/entities/stall.entity';
import { RentPayment } from '../../properties/entities/rent-payment.entity';

/**
 * Defines the Tenant entity. This is necessary to correctly link to Shops and Stalls.
 */
@Entity({name: "Tenant"})
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({nullable: true})
  middleName: string;

  @Column()
  lastName: string;

  @Column({nullable: true})
  contactEmail: string;

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

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}