import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Market } from './market.entity';
import { Shop } from './shop.entity';
import { BuildingStatus } from '../enums/property-status.enum';
import { Maintence } from 'src/maintenance/entities/maintenance.entity';

/**
 * Defines the Building entity, which is part of a Market.
 */
@Entity({name: 'Building'})
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  name: string;

  @Column({})
  description: string;

  @Column({})
  summary: string;

  @Column({
    default: 'working',
  })
  status: string;

  // Many Buildings can belong to one Market
  @ManyToOne(() => Market, (market) => market.buildings, { onDelete: 'CASCADE' })
  market: Market;

  // A Building can have many Shops
  @OneToMany(() => Shop, (shop) => shop.building)
  shops: Shop[];

  //@ManyToOne((type) => Maintence, maintenance => maintenance.buildings)
  //maintenance: Maintence;

  @CreateDateColumn({default: Date.now()})
  createdAt: Date;
}