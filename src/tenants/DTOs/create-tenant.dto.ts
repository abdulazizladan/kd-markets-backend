import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantDto {

    @ApiProperty({
        description: 'First name of tenant'
    })
    firstName: string;

    @ApiProperty({
        description: 'Middle name of tenant'
    })
    middleName: string;

    @ApiProperty({
        description: 'Last name of tenant'
    })
    lastName: string;

    @ApiProperty({
        description: 'email of tenant'
    })
    email: string;

    @ApiProperty({
        description: 'Tenant phone number'
    })
    contactNumber: string;
}