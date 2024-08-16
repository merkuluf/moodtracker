import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from './api.exception';

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: ApiException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception.message || 'Internal Server Error',
        });
    }
}
