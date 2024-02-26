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
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
import { SocialsModule } from './socials/socials.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TransactionsModule } from './transactions/transactions.module';
import { NotificationsModule } from './notifications/notifications.module';
<<<<<<< Updated upstream
=======
import { BanksModule } from './banks/banks.module';
>>>>>>> Stashed changes
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
        SocialsModule,
        SubscriptionsModule,
        TransactionsModule,
        NotificationsModule,
<<<<<<< Updated upstream
=======
        BanksModule,
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
