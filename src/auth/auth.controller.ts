
// src/auth/controllers/auth.controller.ts
import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Controller for handling authentication-related endpoints like login, register, and password reset.
 * Swagger decorators are used to provide clear API documentation.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Authenticates a user and returns a token.
     */
    @ApiOperation({
        summary: 'User Login',
        description: 'Authenticates a user with a username and password and returns an authentication token.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully authenticated. Returns a token.',
        schema: {
            example: {
                accessToken: 'some_jwt_token'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials.'
    })
    @ApiBody({ type: LoginDto, description: 'User login credentials' })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
        const result = await this.authService.login(loginDto);
        // Map 'access_token' to 'accessToken' for the response
        return { accessToken: result.access_token };
    }

    /**
     * Registers a new user.
    
    @ApiOperation({
        summary: 'User Registration',
        description: 'Registers a new user with a username, password, and email.'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User successfully registered.'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Username or email already exists.'
    })
    @ApiBody({ type: RegisterDto, description: 'User registration details' })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.register(registerDto);
    }**/
   
    /**
     * Initiates a password reset process.
     
    @ApiOperation({
        summary: 'Password Reset',
        description: 'Initiates the password reset process by sending an email with a reset link.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Password reset email sent successfully.'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the provided email not found.'
    })
    @ApiBody({ type: PasswordResetDto, description: 'Email for password reset' })
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() passwordResetDto: PasswordResetDto): Promise<void> {
        return this.authService.resetPassword(passwordResetDto);
    }**/
}
