import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        workshops: {
          include: {
            workshop: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const currentWorkshop = user.workshops[0];

    if (!currentWorkshop) {
      throw new UnauthorizedException('User belongs to no workshop');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      workshopId: currentWorkshop.workshopId,
      role: currentWorkshop.role,
    };

    const token = await this.jwtService.signAsync(payload);

    const userWorkshops = user.workshops.map((relation) => ({
      workshopId: relation.workshopId,
      workshopName: relation.workshop.name,
      role: relation.role,
    }));

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      workshops: userWorkshops,
    };
  }

  async register(
    email: string,
    pass: string,
    name: string,
    workshopName: string,
  ) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hash,
        },
      });

      const workshop = await tx.workshop.create({
        data: {
          name: workshopName,
        },
      });

      await tx.usersOnWorkshops.create({
        data: {
          userId: user.id,
          workshopId: workshop.id,
          role: Role.ADMIN,
        },
      });

      return { message: 'Account and Workshop created successfully' };
    });
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid current password');

    const salt = await bcrypt.genSalt();
    const newHash = await bcrypt.hash(newPass, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });

    return { message: 'Password updated' };
  }
}
