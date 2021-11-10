import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { AuthGuard } from './auth.guard'
import { MongoExceptionFilter } from './_filters/mongo-exception.filter'
import { AllExceptionsFilter } from './_filters/all-exceptions.filter';
import { SystemLogsService } from './system-logs/system-logs.service';
import { config } from 'rxjs';

function initSwagger (app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Global Club')
    .setDescription('The Global Club API description' + `<br>
      <p>Tutte le chiamate a questo server devono contenere i seguenti headers oltre al bearer token:</p>
      <ul>
        <li>client-secret</li>
        <li>server-secret</li>
      </ul>
    `)
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  
  const document = SwaggerModule.createDocument(app, config)
  
  SwaggerModule.setup('api-' + process.env.SWAGGER_KEY, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const systemLogsService = app.get(SystemLogsService);
  
  app.setGlobalPrefix('api')
  app.useGlobalGuards(new AuthGuard(configService))
  app.useGlobalFilters(new MongoExceptionFilter(), new AllExceptionsFilter(systemLogsService, configService))
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  
  initSwagger(app)
  
  await app.listen(process.env.PORT || 4000);
}

bootstrap().then(() => null)
