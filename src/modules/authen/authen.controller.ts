import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from 'commons/types';
import { JwtRefreshAuthenGuard } from 'src/commons/guards/jwt-refresh.authen.guard';
import { JwtAuthenGuard } from 'src/commons/guards/jwt.authen.guard';
import { LocalAuthenGuard } from 'src/commons/guards/local.authen.guard';
import { UserService } from '../user/user.service';
import { AuthenService } from './authen.service';
import { LoginDto, RegisterUserDto } from './dto/authen.dto';

@Controller('authen')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenController {
  constructor(
    private readonly authenService: AuthenService,
    private userService: UserService,
  ) {}
  logger = new Logger(AuthenController.name);

  @HttpCode(200)
  @UseGuards(LocalAuthenGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const user = req.user;
    const { accessToken, refreshToken } = this.authenService.getAllToken(
      user.id,
    );

    await this.userService.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  @Post('register')
  async register(@Body() input: RegisterUserDto) {
    return await this.authenService.register(input);
  }

  @UseGuards(JwtAuthenGuard)
  @Get('')
  async getAllUser(@Req() req: RequestWithUser) {
    return await this.authenService.getAllUser();
  }

  @Get('delete')
  async deleteAll() {
    return await this.authenService.deleteAllUser();
  }

  @UseGuards(JwtRefreshAuthenGuard)
  @Get('userWithJWTRefreshToken')
  async getCurrentUserWRT(@Req() request) {
    return request?.user;
  }

  @UseGuards(JwtAuthenGuard)
  @Get('userWithToken')
  async getCurrentUserWT(@Req() request) {
    return request?.user;
  }

  @UseGuards(JwtRefreshAuthenGuard)
  @Get('refreshToken')
  async refreshToken(@Req() req: RequestWithUser) {
    const user = req.user;
    const accessToken = this.authenService.getAccessToken(user.id);

    return { accessToken };
  }

  @UseGuards(JwtAuthenGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    const { user } = req;
    return await this.authenService.removeRefreshToken(user.id);
  }

  @Get('ahihi')
  async ahihi() {
    return 'ahihi';
  }
}

// clear cookies
//  'Authentication=; HttpOnly; Path=/; Max-Age=0',
//       'Refresh=; HttpOnly; Path=/; Max-Age=0'
