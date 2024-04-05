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
import { ActivitiesModule } from './activities/activities.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { StockModule } from './stock/stock.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { ForumModule } from './forum/forum.module';

// configService.get('POST_G_DB_URL')
@Module({
    imports: [
        CacheModule.register({isGlobal:true}),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory:(configService:ConfigService) => ({
                type: 'mysql',
                host: 'ttwebadmin.c3g8gce48972.us-east-1.rds.amazonaws.com',
                port: 3306,
                username: 'ttadmin',
                password: '5vOwv851szeR',
                database: 'ttwebadmin',
                entities: ['dist/**/*.entity{ .ts,.js}'],
                // synchronize: true,
                logging:true
            })
        }),
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
        StockModule,
        WatchlistModule,
        CompetitionsModule,
        ForumModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule{

}

