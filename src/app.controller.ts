import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    // @Get()
    // @UseInterceptors(LoggingInterceptor)
    // getHello(): string {
    //     console.log('hello world');
    //     return this.appService.getHello();
    // }
}
