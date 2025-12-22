import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OperatorsService } from '../operators/operators.service';

@Injectable()
export class AuthService {
  constructor(
    private operatorsService: OperatorsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const operator = await this.operatorsService.findByUsername(username);
    if (operator && await bcrypt.compare(password, operator.password)) {
      const { password, ...result } = operator;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Noto\'g\'ri foydalanuvchi nomi yoki parol');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    };
  }
}

