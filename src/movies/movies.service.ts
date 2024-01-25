import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMovie } from 'src/common/interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class MoviesService {
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    @InjectModel('movies') private movies: Model<IMovie>,
  ) {
    this.redis = this.redisService.getClient('moviecache');
  }
  async addMovie(data) {
    try {
      const movie: IMovie = await this.movies.create(data);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully Created Movie',
        data: movie,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateMovieById(id, payload) {
    try {
      const movie = await this.movies.updateOne(
        { _id: new ObjectId(id) },
        payload,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully Updated Movie',
        data: movie,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllMovie(page = 1, pageSize = 10) {
    try {
      const skip = (page - 1) * pageSize;
      const movies: IMovie[] = await this.movies
        .find({ isDeleted: false })
        .skip(skip)
        .limit(pageSize);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully Fetched Movies',
        data: movies,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMovie(query) {
    let cacheKey = 'movie_';
    const whereQuery: { title?: string; genre?: string; isDeleted: boolean } = {
      isDeleted: false,
    };
    if (query?.title) {
      whereQuery.title = query.title;
      cacheKey += query.title;
    }
    if (query?.genre) {
      whereQuery.genre = query.genre;
      cacheKey += query.genre;
    }
    let movies: IMovie[];
    //cache
    const data = await this.redis.get(cacheKey);
    console.log(data);
    if (data) {
      movies = JSON.parse(data);
    } else {
      movies = await this.movies.find(whereQuery);
      this.redis.set(cacheKey, JSON.stringify(movies));
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Fetched Movies',
      data: movies,
    };
  }

  async deleteMovieById(id) {
    try {
      const movie = await this.movies.updateOne(
        { _id: new ObjectId(id) },
        { isDeleted: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted Movie',
        data: movie,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
