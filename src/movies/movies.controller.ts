import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AddMovieRequestDto, UpdateMovieRequestDto } from './movies.dto';
import { JoiValidationPipe } from 'src/common/pipes/joi.pipe';
import { addMovieRequestValidation } from './movies.validation';
import { MoviesService } from './movies.service';
import {
  handleErrorResponse,
  handleForbiddenResponse,
} from '../common/utils/response.utils';
import { JwtAuthGuard } from '../common/auth-guard/auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @Post('')
  @UsePipes(new JoiValidationPipe(addMovieRequestValidation))
  async addMovie(
    @Req() req: any,
    @Res() response: any,
    @Body() body: AddMovieRequestDto,
  ) {
    try {
      if (req.user.role != 'admin') {
        return handleForbiddenResponse(response);
      }
      const result = await this.moviesService.addMovie(body);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      const errorResponse = {
        message: error.message,
        errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return handleErrorResponse(response, errorResponse);
    }
  }

  @Get('')
  async getAllMovies(@Req() req: any, @Query() query, @Res() response: any) {
    try {
      const result = await this.moviesService.getAllMovie(
        query?.page,
        query?.pageSize,
      );
      return response.status(result.statusCode).send(result);
    } catch (error) {
      const errorResponse = {
        message: error.message,
        errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return handleErrorResponse(response, errorResponse);
    }
  }

  @Get('/search')
  async getMovie(@Req() req: any, @Query() query, @Res() response: any) {
    try {
      console.log('query', query);
      const result = await this.moviesService.getMovie(query);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      const errorResponse = {
        message: error.message,
        errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return handleErrorResponse(response, errorResponse);
    }
  }

  @Put('/:id')
  async updateMovie(
    @Param() params,
    @Req() req: any,
    @Res() response: any,
    @Body() body: UpdateMovieRequestDto,
  ) {
    try {
      if (req.user.role != 'admin') {
        return handleForbiddenResponse(response);
      }
      const result = await this.moviesService.updateMovieById(params.id, body);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      const errorResponse = {
        message: error.message,
        errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return handleErrorResponse(response, errorResponse);
    }
  }

  @Delete('/:id')
  async deleteMovie(@Param() params, @Req() req: any, @Res() response: any) {
    try {
      if (req.user.role != 'admin') {
        return handleForbiddenResponse(response);
      }
      const result = await this.moviesService.deleteMovieById(params.id);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      const errorResponse = {
        message: error.message,
        errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return handleErrorResponse(response, errorResponse);
    }
  }
}
