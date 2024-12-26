import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Postgres Replica API Docs')
    .setDescription('Postgres Replica API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const customSiteTitle: SwaggerCustomOptions = {
    customSiteTitle: 'Postgres Replica API Docs',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showCommonExtensions: true,
    },
  };
  SwaggerModule.setup('api', app, document, customSiteTitle);
}
