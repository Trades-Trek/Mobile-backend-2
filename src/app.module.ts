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
import {QueueModule} from "./queues/queue.module";
import { PlansModule } from './plans/plans.module';
import { SocialsModule } from './socials/socials.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TransactionsModule } from './transactions/transactions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BanksModule } from './banks/banks.module';

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
        QueueModule,
        UsersModule,
        OtpModule,
        ReferralsModule,
        PlansModule,
        SocialsModule,
        SubscriptionsModule,
        TransactionsModule,
        NotificationsModule,
        BanksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
