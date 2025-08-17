import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { Building } from "./building.entity";
import { Stall } from "./stall.entity";
import { Address } from "./address.entity";

@Entity({name: 'Market'})
export class Market {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    name: string;

    @OneToOne(() => Address)
    @JoinColumn() // This decorator makes Market the owning side of the relationship
    address: Address;

    @OneToMany((type) => Building, building => building.market)
    buildings: Building[];

    @OneToMany((type) => Stall, stalls => stalls.market)
    stalls: Stall[];
}