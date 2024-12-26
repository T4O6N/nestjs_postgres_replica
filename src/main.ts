import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TimezoneInterceptor } from './common/interceptors/timezone.interceptor';
import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  try {
    logger.log('Starting application...');
    logger.log('Database connection...');
    logger.log('Database connection...');

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    logger.log('NestJS application started...');

    app.useGlobalInterceptors(new TimezoneInterceptor());

    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'api/v',
      defaultVersion: null,
    });

    app.enableCors({
      origin: '*',
      credentials: true,
    });
    logger.log('CORS enabled...');

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    if (process.env.SWAGGER_ENABLED === 'true') {
      setupSwagger(app);
      logger.log('Swagger enabled...');
    }

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}/api`);
  } catch (error) {
    logger.error('Application failed to start', error);
  }
}
bootstrap();
