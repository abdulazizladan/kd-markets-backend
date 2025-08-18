import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { initialize } from 'passport';

@Controller('payments')
export class PaymentsController {
    
    @Post('initialize')
    @ApiOperation({summary: 'Inititialize payment process', description: 'Inititialize payment process'})
    initialize() {

    }

    @Get('verify/:reference')
    @ApiOperation({summary: 'Verify payment', description: 'Verify and complete an initialized payment'})
    verify(reference: string) {

    }

    @Post('webhook')
    @ApiOperation({summary: '', description: ''})
    webhook() {

    }
}
