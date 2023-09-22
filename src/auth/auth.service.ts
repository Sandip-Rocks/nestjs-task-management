import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userService: typeof User,
    private jwtService: JwtService,
  ) {}
  logger = new Logger();

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userService.create({
      username,
      password: hashedPassword,
    });
    try {
      (await user).save();
      return user;
    } catch (error) {
      console.error(error);
      //TODO: ERROR handling
      throw new InternalServerErrorException(error.message);
    }
  }
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userService.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else
      throw new UnauthorizedException('Please check your login credentials');
  }
}
