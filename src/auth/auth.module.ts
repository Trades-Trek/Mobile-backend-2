import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {GoogleStrategy} from "./strategies/google.strategy";

@Module({
    imports: [PassportModule, JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
            global: true,
            secret: configService.get('JWT_SECRET'),
            signOptions: {expiresIn: '60s'},
        }),
        inject: [ConfigService]
    }),],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy],
})
export class AuthModule {
}
