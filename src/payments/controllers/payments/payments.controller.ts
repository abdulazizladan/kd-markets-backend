import { Controller, Get, Post } from '@nestjs/common';
import { initialize } from 'passport';

@Controller('payments')
export class PaymentsController {
    
    @Post('initialize')
    initialize() {

    }

    @Get('verify/:reference')
    verify(reference: string) {

    }

    @Post('webhook')
    webhook() {

    }
}
