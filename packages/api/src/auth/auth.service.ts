import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(email: string, pass: string, name: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);

    return this.usersService.create({
      email,
      name,
      password: hash,
    });
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.usersService.findById(userId);

    if (!user) throw new UnauthorizedException('Usuário não encontrado.');

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('A senha atual está incorreta.');
    }

    const salt = await bcrypt.genSalt();
    const newHash = await bcrypt.hash(newPass, salt);

    await this.usersService.updatePassword(userId, newHash);

    return { message: 'Senha alterada com sucesso.' };
  }
}
