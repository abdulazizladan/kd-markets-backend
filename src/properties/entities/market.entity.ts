import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, CreateDateColumn } from "typeorm";
import { Building } from "./building.entity";
import { Stall } from "./stall.entity";
import { Address } from "./address.entity";
import { Maintence } from "src/maintenance/entities/maintenance.entity";

@Entity({name: 'Market'})
export class Market {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    name: string;

    @OneToOne(() => Address)
    @JoinColumn() // This decorator makes Market the owning side of the relationship
    address: Address;

    @OneToMany((type) => Building, building => building.market, {nullable: true})
    buildings: Building[];

    @OneToMany((type) => Stall, stalls => stalls.market, {nullable: true})
    stalls: Stall[];

    //@ManyToOne((type) => Maintence, maintenance => maintenance.markets)
    //maintenance: Maintence;

    @CreateDateColumn({default: Date.now()})
    createdAt: Date;
}