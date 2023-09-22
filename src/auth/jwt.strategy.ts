import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtPayload } from './jwt-payload.interface';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private readonly userService: typeof User,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.userService.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
