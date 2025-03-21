import { Module } from '@nestjs/common';

import { HashingService } from '../services/hash.service';

@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class HashModule {}
