import { HttpStatus } from '@nestjs/common';

export interface IStandardResponse {
  statusCode: HttpStatus;
  message: string;
  data?: any;
  error?: any;
}
