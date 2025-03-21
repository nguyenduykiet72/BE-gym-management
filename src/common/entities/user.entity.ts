import { Exclude, Transform } from 'class-transformer';
import { Role, Gender, UserStatus } from '@prisma/client';

export class UserEntity {
  id: number;

  email: string;

  @Exclude()
  password: string;

  firstName: string;

  lastName: string;

  role: Role;

  phone?: string;

  address?: string;

  city?: string;

  @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  dateOfBirth?: Date;

  gender?: Gender;

  avatar?: string;

  status: UserStatus;

  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  @Transform(({ value }) => value.toISOString())
  updatedAt: Date;

  isVerified: boolean;

  @Exclude() 
  verificationToken?: string;

  @Exclude()
  resetPasswordToken?: string;

  @Exclude()
  resetPasswordExpires?: Date;

  @Transform(({ value }) => (value ? value.toISOString() : null))
  lastLogin?: Date;

  twoFactorEnabled: boolean;

  @Exclude() 
  twoFactorSecret?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
