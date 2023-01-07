import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { ErrorsInterceptor } from './utils/interceptors/error.interceptor';
import { GoogleAuthenticationModule } from './modules/google-authentication/google-authentication.module';
import { AuthenModule } from './modules/authen/authen.module';
import { User } from './modules/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'postgres',
        port: configService.get('PORT_POSTGRES_DOCKER'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true,
        entities: [User],
      }),
    }),
    MailModule,
    UserModule,
    PostModule,
    GoogleAuthenticationModule,
    AuthenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
