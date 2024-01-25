import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesSchema } from '../common/schema/index';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'movies', schema: MoviesSchema }]),
  ],

  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
