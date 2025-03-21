import { Global, Module } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
