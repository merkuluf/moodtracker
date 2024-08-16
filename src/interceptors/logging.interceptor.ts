import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap, zip } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const userAgent = request.get('user-agent') || '';
        const { ip, method, path: url } = request;
        //  context.getClass().name = name of the Controller (Class)
        //  context.getHandler().name = name of the Class Method
        this.logger.log(
            `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name} invoked...`
        );
        return next.handle().pipe(
            tap((res) => {
                const response = context.switchToHttp().getResponse();

                const { statusCode } = response;
                const contentLength = response.get('content-length');

                this.logger.log(`
                    ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${Date.now() - now}ms`);
                this.logger.debug('Response', res);
            })
        );
        // this.logger.debug('userId:', this)
    }
}
