import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AuthGuard} from "./auth.guard";
import {ConfigModule, ConfigService} from "@nestjs/config";

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Global Club')
    .setDescription('The Global Club API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  initSwagger(app)
  
  app.useGlobalGuards(new AuthGuard(configService))
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  
  await app.listen(4000);
}

bootstrap();
