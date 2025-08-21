import { ApiProperty } from "@nestjs/swagger";

export class CreateMaintenance {

    @ApiProperty({})
    dateOfMaintenance: Date;

    @ApiProperty({})
    description: string;

    @ApiProperty({})
    cost: number;

    @ApiProperty({})
    recordType: string;

    @ApiProperty({})
    status: string;

    @ApiProperty({})
    paymentStatus: string;
}