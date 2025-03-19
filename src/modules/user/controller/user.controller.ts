import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() data: { email: string; name?: string; password: string },
  ) {
    return this.userService.create(data);
  }

  @Get()
  async findAll() {
    this.userService.findAll();
  }
}
