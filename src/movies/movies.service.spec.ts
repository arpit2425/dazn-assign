import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Model } from 'mongoose';
import { IMovie } from 'src/common/interface';
import { ObjectId } from 'mongodb';
import Redis from 'ioredis';

// Mocking the RedisService
jest.mock('@liaoliaots/nestjs-redis', () => ({
  RedisService: jest.fn(() => ({
    getClient: jest.fn(() => new Redis()),
  })),
}));

describe('MoviesService', () => {
  let service: MoviesService;
  let model: Model<IMovie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken('movies'),
          useValue: Model,
        },
        RedisService,
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    model = module.get<Model<IMovie>>(getModelToken('movies'));
  });

  describe('addMovie', () => {
    it('should add a movie', async () => {
      const createSpy = jest
        .spyOn(model.prototype, 'create')
        .mockResolvedValueOnce({
          _id: new ObjectId(),
          title: 'Inception',
          genre: 'Sci-Fi',
          isDeleted: false,
        } as IMovie);

      const result = await service.addMovie({
        title: 'Inception',
        genre: 'Sci-Fi',
      });

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Successfully Created Movie');
      expect(result.data).toBeDefined();
      expect(createSpy).toHaveBeenCalledWith({
        title: 'Inception',
        genre: 'Sci-Fi',
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(model.prototype, 'create')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.addMovie({
          title: 'Inception',
          genre: 'Sci-Fi',
        }),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('updateMovieById', () => {
    it('should update a movie by ID', async () => {
      const updateOneSpy = jest
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({
          nModified: 1,
        } as any);

      const result = await service.updateMovieById('some-id', {
        title: 'Updated Inception',
      });

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Successfully Updated Movie');
      expect(result.data).toBeDefined();
      expect(updateOneSpy).toHaveBeenCalledWith(
        { _id: new ObjectId('some-id') },
        { title: 'Updated Inception' },
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(model, 'updateOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.updateMovieById('some-id', {
          title: 'Updated Inception',
        }),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getAllMovie', () => {
    it('should get all movies with pagination', async () => {
      const findSpy = jest.spyOn(model, 'find').mockResolvedValueOnce([
        {
          _id: new ObjectId(),
          title: 'Inception',
          genre: 'Sci-Fi',
          isDeleted: false,
        },
        {
          _id: new ObjectId(),
          title: 'Interstellar',
          genre: 'Sci-Fi',
          isDeleted: false,
        },
      ] as IMovie[]);

      const result = await service.getAllMovie(1, 10);

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Successfully Fetched Movies');
      expect(result.data).toHaveLength(2);
      expect(findSpy).toHaveBeenCalledWith({ isDeleted: false });
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(model, 'find')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getAllMovie(1, 10)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('getMovie', () => {
    it('should get movies based on query parameters', async () => {
      const findSpy = jest.spyOn(model, 'find').mockResolvedValueOnce([
        {
          _id: new ObjectId(),
          title: 'Inception',
          genre: 'Sci-Fi',
          isDeleted: false,
        },
        {
          _id: new ObjectId(),
          title: 'Interstellar',
          genre: 'Sci-Fi',
          isDeleted: false,
        },
      ] as IMovie[]);

      const redisGetSpy = jest
        .spyOn(service['redis'], 'get')
        .mockResolvedValueOnce(null);
      const redisSetSpy = jest.spyOn(service['redis'], 'set');

      const result = await service.getMovie({
        title: 'Inception',
        genre: 'Sci-Fi',
      });

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Successfully Fetched Movies');
      expect(result.data).toHaveLength(2);
      expect(findSpy).toHaveBeenCalledWith({
        title: 'Inception',
        genre: 'Sci-Fi',
        isDeleted: false,
      });
      expect(redisGetSpy).toHaveBeenCalledWith('movie_InceptionSci-Fi');
      expect(redisSetSpy).toHaveBeenCalledWith(
        'movie_InceptionSci-Fi',
        JSON.stringify(result.data),
      );
    });

    it('should get movies from cache if available', async () => {
      jest.spyOn(service['redis'], 'get').mockResolvedValueOnce(
        JSON.stringify([
          {
            _id: new ObjectId(),
            title: 'Inception',
            genre: 'Sci-Fi',
            isDeleted: false,
          },
        ]),
      );

      const findSpy = jest.spyOn(model, 'find');
      const redisSetSpy = jest.spyOn(service['redis'], 'set');

      const result = await service.getMovie({
        title: 'Inception',
        genre: 'Sci-Fi',
      });

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Successfully Fetched Movies');
      expect(result.data).toHaveLength(1);
      expect(findSpy).not.toHaveBeenCalled();
      expect(redisSetSpy).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(model, 'find')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.getMovie({
          title: 'Inception',
          genre: 'Sci-Fi',
        }),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteMovieById', () => {
    it('should delete a movie by ID', async () => {
      const updateOneSpy = jest
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({
          nModified: 1,
        } as any);

      const result = await service.deleteMovieById('some-id');

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Successfully deleted Movie');
      expect(result.data).toBeDefined();
      expect(updateOneSpy).toHaveBeenCalledWith(
        { _id: new ObjectId('some-id') },
        { isDeleted: true },
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(model, 'updateOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.deleteMovieById('some-id')).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
});
