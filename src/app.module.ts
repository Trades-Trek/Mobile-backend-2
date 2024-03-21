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
import { WalletModule } from './wallet/wallet.module';
import { RatingsModule } from './ratings/ratings.module';
import { FeaturesModule } from './features/features.module';
import {CacheModule} from "@nestjs/cache-manager";
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { ActivitiesModule } from './activities/activities.module';


@Module({
    imports: [
        CacheModule.register({isGlobal:true}),
        // TypeOrmModule.forRootAsync({
        //     imports: [MongooseModule],
        //     useFactory:(configService:ConfigService) => ({
        //         url:configService.get('POST_G_DB_URL'),
        //         entities: ['dist/**/*.entity{ .ts,.js}'],
        //         synchronize: true,
        //         logging:true
        //     })
        // }),
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
        WalletModule,
        RatingsModule,
        FeaturesModule,
        PromoCodesModule,
        WatchlistModule,
        ActivitiesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule{

}

