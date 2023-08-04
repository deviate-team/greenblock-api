import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { TransactionModule } from './transaction/transaction.module';
import { UsersModule } from './users/users.module';
import { OffsetModule } from './offets/offset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
    }),
    AuthModule,
    TicketsModule,
    TransactionModule,
    UsersModule,
    OffsetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
