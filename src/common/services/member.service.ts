import { Injectable } from '@nestjs/common';
import { Member, MembershipStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMembers() {
    return this.prismaService.member.findMany();
  }

  async getUsers() {
    return this.prismaService.user.findMany();
  }

  async createMember(userId: number): Promise<Member> {
    return this.prismaService.member.create({
      data: {
        userId,
        memberSince: new Date(),
        membershipStatus: MembershipStatus.PENDING,
      },
    });
  }
}
