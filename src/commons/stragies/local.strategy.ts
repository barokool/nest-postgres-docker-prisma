import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenService } from 'src/modules/authen/authen.service';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenService: AuthenService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    const logger = new Logger(LocalStrategy.name);
    logger.debug('email : ' + email + ', password : ' + password);
    const s = await this.authenService.getAuthenticatedUser(email, password);
    logger.debug('s : ' + s.email);
    return s;
  }
}
