import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantDto {

    @ApiProperty({
        description: 'Full name of tenant'
    })
    name: string;

    @ApiProperty({
        description: 'Tenant phone number'
    })
    contactNumber: string;
}