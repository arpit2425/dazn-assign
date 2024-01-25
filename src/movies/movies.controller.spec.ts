import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

jest.mock('./movies.service');

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  describe('addMovie', () => {
    it('should add a movie', async () => {
      const mockAddMovieResult = {
        statusCode: HttpStatus.OK,
        message: 'Successfully Created Movie',
        data: {},
      };

      jest.spyOn(service, 'addMovie').mockResolvedValueOnce(mockAddMovieResult);

      const req = { user: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.addMovie(req, res, {});

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockAddMovieResult);
    });

    it('should return forbidden response if user is not admin', async () => {
      const req = { user: { role: 'user' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.addMovie(req, res, {});

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(service, 'addMovie')
        .mockRejectedValueOnce(new Error('Internal Server Error'));

      const req = { user: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.addMovie(req, res, {});

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getAllMovies', () => {
    it('should get all movies', async () => {
      const mockGetAllMoviesResult = {
        statusCode: HttpStatus.OK,
        message: 'Successfully Fetched Movies',
        data: [],
      };

      jest
        .spyOn(service, 'getAllMovie')
        .mockResolvedValueOnce(mockGetAllMoviesResult);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const query = { page: 1, pageSize: 10 };

      await controller.getAllMovies(req, query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockGetAllMoviesResult);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(service, 'getAllMovie')
        .mockRejectedValueOnce(new Error('Internal Server Error'));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const query = { page: 1, pageSize: 10 };

      await controller.getAllMovies(req, query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getMovie', () => {
    it('should get movies based on query parameters', async () => {
      const mockGetMovieResult = {
        statusCode: HttpStatus.OK,
        message: 'Successfully Fetched Movies',
        data: [],
      };

      jest.spyOn(service, 'getMovie').mockResolvedValueOnce(mockGetMovieResult);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const query = { title: 'Inception', genre: 'Sci-Fi' };

      await controller.getMovie(req, query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockGetMovieResult);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(service, 'getMovie')
        .mockRejectedValueOnce(new Error('Internal Server Error'));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const query = { title: 'Inception', genre: 'Sci-Fi' };

      await controller.getMovie(req, query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie by ID', async () => {
      const mockUpdateMovieResult = {
        statusCode: HttpStatus.OK,
        message: 'Successfully Updated Movie',
        data: {},
      };

      jest
        .spyOn(service, 'updateMovieById')
        .mockResolvedValueOnce(mockUpdateMovieResult);

      const req = { user: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const params = { id: 'some-id' };
      const body = {};

      await controller.updateMovie(params, req, res, body);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockUpdateMovieResult);
    });

    it('should return forbidden response if user is not admin', async () => {
      const req = { user: { role: 'user' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const params = { id: 'some-id' };
      const body = {};

      await controller.updateMovie(params, req, res, body);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(service, 'updateMovieById')
        .mockRejectedValueOnce(new Error('Internal Server Error'));

      const req = { user: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const params = { id: 'some-id' };
      const body = {};

      await controller.updateMovie(params, req, res, body);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie by ID', async () => {
      const mockDeleteMovieResult = {
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted Movie',
        data: {},
      };

      jest
        .spyOn(service, 'deleteMovieById')
        .mockResolvedValueOnce(mockDeleteMovieResult);

      const req = { user: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const params = { id: 'some-id' };

      await controller.deleteMovie(params, req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockDeleteMovieResult);
    });

    it('should return forbidden response if user is not admin', async () => {
      const req = { user: { role: 'user' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const params = { id: 'some-id' };

      await controller.deleteMovie(params, req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(service, 'deleteMovieById')
        .mockRejectedValueOnce(new Error('Internal Server Error'));

      const req = { user: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const params = { id: 'some-id' };

      await controller.deleteMovie(params, req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
