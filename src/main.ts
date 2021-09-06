import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AuthGuard} from "./auth.guard";

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Global Club')
    .setDescription('The Global Club API description')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  initSwagger(app)
  
  app.useGlobalGuards(new AuthGuard())
  
  await app.listen(4000);
}

bootstrap();
