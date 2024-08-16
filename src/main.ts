import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ApiExceptionFilter } from './middleware/api-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    dotenv.config();

    const app = await NestFactory.create(AppModule);

    // // Swagger configuration
    // const config = new DocumentBuilder()
    //     .setTitle('CDM KISS REST API')
    //     .setDescription('description')
    //     .setVersion('1.0')
    //     .build();

    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('documentation', app, document);

    app.useGlobalFilters(new ApiExceptionFilter());
    app.enableCors();

    // Determine the port based on the environment
    const port = process.env.NODE_ENV === 'dev' ? 3005 : 3000;

    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
