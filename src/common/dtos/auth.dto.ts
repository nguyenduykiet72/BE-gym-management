import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';
import { MemberEntity } from '../entities/member.entity';
import { UserEntity } from '../entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  //   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
  //     message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  //   })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,11}$/, { message: 'Phone number is not valid' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,11}$/, { message: 'Emergency phone number is not valid' })
  emergencyPhone?: string;

  @IsOptional()
  @IsString()
  healthNotes?: string;
}

export class RegisterResponseDto {
  user: UserEntity;

  member?: MemberEntity;

  message: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LoginBodyDTO {
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Password must be at least 6 characters' })
  password: string;
}


export class LoginEntityResponse {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginEntityResponse>) {
    Object.assign(this, partial);
  }
}
