import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {GoogleStrategy} from "./strategies/google.strategy";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "../guards/auth.guard";
import {DomainGuard} from "../guards/domain.guard";
import {VersionGuard} from "../guards/version.guard";

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
    providers: [{
        provide: APP_GUARD,
        useClass: DomainGuard
    }, {
        provide: APP_GUARD,
        useClass: VersionGuard
    }, {
        provide: APP_GUARD,
        useClass: AuthGuard
    }, AuthService, GoogleStrategy],
})
export class AuthModule {
}
