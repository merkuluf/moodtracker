import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
    private generateShortId(): string {
        return uuidv4().split('-').pop(); // Используем последний сегмент UUIDv4
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const requestId = this.generateShortId(); // Генерация уникального идентификатора для каждого запроса
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const userAgent = request.get('user-agent') || 'unknown';

        const ip =
            request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;

        const { method, path: url } = request;

        this.logger.log(`[${requestId}] ${method} ${url} ${ip} ${userAgent}`);

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;
                const processingTime = Date.now() - now;

                this.logger.log(`[${requestId}] ${method} ${url}, status ${statusCode}, took ${processingTime}ms`);
            })
        );
    }
}
