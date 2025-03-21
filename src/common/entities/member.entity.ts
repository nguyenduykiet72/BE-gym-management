import { Transform } from 'class-transformer';
import { MembershipStatus } from '@prisma/client';

export class MemberEntity {
  id: number;

  userId: number;

  emergencyContact?: string;

  emergencyPhone?: string;

  healthNotes?: string;

  @Transform(({ value }) => value.toISOString())
  memberSince: Date;

  @Transform(({ value }) => (value ? value.toISOString() : null))
  expiryDate?: Date;

  membershipStatus: MembershipStatus;

  remainingPT: number;

  membershipPlanId?: number;

  constructor(partial: Partial<MemberEntity>) {
    Object.assign(this, partial);
  }
}
