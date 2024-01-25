import { HttpStatus } from '@nestjs/common';
import { ResponseMessageEnum } from '../global.enum';

export const handleErrorResponse = (
  responseHandler: any,
  errorResponse: any,
) => {
  const responseObj = {
    statusCode: HttpStatus.BAD_REQUEST,
    message: ResponseMessageEnum.SOMETHING_WENT_WRONG,
  };

  if (typeof errorResponse == 'object' && 'errorCode' in errorResponse) {
    responseObj.message = errorResponse.message;
    responseObj.statusCode = errorResponse?.errorCode;
  }

  return responseHandler.status(responseObj.statusCode).send(responseObj);
};
export const handleForbiddenResponse = (responseHandler: any) => {
  const responseObj = {
    statusCode: HttpStatus.FORBIDDEN,
    message: ResponseMessageEnum.FORBIDDEN,
  };

  return responseHandler.status(responseObj.statusCode).send(responseObj);
};
