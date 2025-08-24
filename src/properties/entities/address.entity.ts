import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { Market } from './market.entity';

@Entity({name: 'MarketAddress'})
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({})
  streetAddress: string;

  @Column({})
  town: string;

  @Column({})
  lga: string;

  @Column({ default: 'Kaduna' })
  state: string;

  @OneToOne((type) => Market, market => market.address)
  markey: Market;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}