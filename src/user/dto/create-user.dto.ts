import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsEnum, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { CreateInfoDto } from "./create-info.dto";
import { Role } from "../enums/role.enum";
import { CreateContactDto } from "./create-contact.dto";

export class CreateUserDto {
    @ApiProperty({})
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty(
        {
            enum: [
                "admin", 
                "director", 
                "manager"
            ], 
            default: "manager"
        }
    )
    @IsEnum(Role)
    role: Role;

    @ApiProperty({})
    @IsObject()
    @ValidateNested()
    @Type(() => CreateInfoDto)
    info: CreateInfoDto

    @ApiProperty({})
    @IsObject()
    @ValidateNested()
    @Type(() => CreateContactDto)
    contact: CreateContactDto;
}
