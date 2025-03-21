import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { HashingService } from '../services/hash.service';
import { TokenService } from '../services/token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from './token.module';
import { MemberService } from '../services/member.service';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, HashingService, MemberService],
  exports: [AuthService, HashingService],
})
export class AuthModule {}
