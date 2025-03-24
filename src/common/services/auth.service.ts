import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashingService } from './hash.service';
import { TokenService } from './token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { MembershipStatus, Prisma, Role } from '@prisma/client';
import { LoginBodyDTO, RegisterDto } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);

    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      return this.generateTokens({ userId });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      throw new UnauthorizedException();
    }
  }

  async register(body: RegisterDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashingService.hash(body.password);
    return this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          address: body.address,
          role: Role.MEMBER,
        },
      });

      if (user.role === Role.MEMBER) {
        await tx.member.create({
          data: {
            userId: user.id,
            memberSince: new Date(),
            emergencyContact: body.emergencyContact,
            emergencyPhone: body.emergencyPhone,
            healthNotes: body.healthNotes,
            membershipStatus: MembershipStatus.PENDING,
          },
        });
      }

      return { user, message: 'User created successfully' };
    });
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ]);
    }

    const token = await this.generateTokens({ userId: user.id });
    return token;
  }
}
