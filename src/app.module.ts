import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import configuration from "./config/configuration";
import {PassportModule} from "@nestjs/passport";
import { OtpModule } from './otp/otp.module';
import { ReferralsModule } from './referrals/referrals.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        },),
        AuthModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('DB_URL'),
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        OtpModule,
        ReferralsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
