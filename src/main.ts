import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { AuthGuard } from './auth.guard'
import { ConfigService } from '@nestjs/config'
import { MongoExceptionFilter } from './_filters/mongo-exception.filter'

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Global Club')
    .setDescription('The Global Club API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  
  const document = SwaggerModule.createDocument(app, config)
  
  SwaggerModule.setup('api-' + process.env.SWAGGER_KEY, app, document)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api')
  app.useGlobalGuards(new AuthGuard(configService))
  app.useGlobalFilters(new MongoExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  
  initSwagger(app)
  
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
