import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { MoviesModule } from './movies/movies.module';
import { MoviesSchema } from './common/schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'movies', schema: MoviesSchema }]),
    RedisModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule here as well
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<{
        config: {
          namespace: string;
          port: number;
          host: string;
          password: string;
        };
      }> => {
        return {
          config: {
            namespace: 'moviecache',
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
          },
        };
      },
    }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
