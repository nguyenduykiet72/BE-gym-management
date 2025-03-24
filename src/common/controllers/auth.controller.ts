import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDTO, LoginEntityResponse, RegisterDto, RegisterResponseDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    return new RegisterResponseDto(await this.authService.register(body));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBodyDTO) {
    return new LoginEntityResponse(await this.authService.login(body));
  }
}
