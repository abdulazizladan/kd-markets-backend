import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}