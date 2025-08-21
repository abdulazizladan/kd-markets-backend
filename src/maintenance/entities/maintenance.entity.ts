import { Building } from "src/properties/entities/building.entity";
import { Market } from "src/properties/entities/market.entity";
import { Shop } from "src/properties/entities/shop.entity";
import { Stall } from "src/properties/entities/stall.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Maintenance'})
export class Maintence {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    dateOfMaintenance: Date;

    @Column({type: 'text', nullable: false})
    description: string;

    @Column({type: 'real', nullable: false})
    cost: number;

    // This column specifies the type of the record (`Market`, `Building`, `Stall`, or `Shop`)
    @Column()
    recordType: string;

    //This column specifies the status of the maintenance activity (`Pending`, `In progress`, `Completed` or `Canceled`)
    @Column({nullable: true})
    status: string;

    //The column specifies the status of payment for the maintenance activity (`Pending`, `Paid` or `Canceled`)
    @Column({nullable: true})
    paymentStatus: string;

    //@OneToMany((type) => Market, market => market.maintenance)
    //markets: Market[];

    //@OneToMany((type) => Building, building => building.maintenance)
    //buildings: Building[];

    //@OneToMany((type) => Shop, shop => shop.maintenance)
    //shops: Shop[];

    //@OneToMany((type) => Stall, stall => stall.maintenance)
    //stall: Stall[];
}