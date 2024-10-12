import httpStatus from 'http-status';
import Response from './Response';

export class ErrorHandler {
  static handleResponseStatus = async (res, statusCode, message = null) => {
    switch (statusCode) {
      case 400:
        return Response.errorMessage(
          res,
          message || 'Bad Request',
          httpStatus.BAD_REQUEST
        );

      case 401:
        return Response.errorMessage(
          res,
          'Unauthorized',
          httpStatus.UNAUTHORIZED
        );

      case 403:
        return Response.errorMessage(res, 'Forbidden', httpStatus.FORBIDDEN);

      case 404:
        return Response.errorMessage(res, 'Not Found', httpStatus.NOT_FOUND);

      case 409:
        return Response.errorMessage(
          res,
          message || 'Conflict',
          httpStatus.CONFLICT
        );

      case 500:
        return Response.errorMessage(
          res,
          'Internal Server Error',
          httpStatus.INTERNAL_SERVER_ERROR
        );

      default:
        Response.errorMessage(
          res,
          'Internal Server Error',
          httpStatus.INTERNAL_SERVER_ERROR
        );
    }
  };
}
