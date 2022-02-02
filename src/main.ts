import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { AuthGuard } from './auth.guard'
import { MongoExceptionFilter } from './_filters/mongo-exception.filter'
import { AllExceptionsFilter } from './_filters/all-exceptions.filter';
import { SystemLogsService } from './system-logs/system-logs.service';

function initSwagger (app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Global Club')
    .setDescription(`<p>
      This server can't be directly accessed due to required secret headers and auth user.<br>
      For this reason, each call to this server must be proxied through <code>${process.env.MAIN_SERVER_URL + "/ext/club/"}</code></p>
      <p>Along with proxying the calls, each of them must provide 2 headers:</p>
      <ul>
        <li>Authorization: Bearer XXXXXX</li>
        <li>Client-Key: XXXXXX</li>
      </ul>
    `)
    .setVersion(process.env.npm_package_version)
    .addBearerAuth()
    .addServer(process.env.MAIN_SERVER_URL + "/ext/club/", "Server that will proxy the requests to this server.")
    .addServer("http://localhost:4000/api", "Local server")
    .addApiKey({ type: "apiKey", name: "Client-Key", description: "Client key specific for each client app." }, "client-key")
    .build()
  
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true
  })
  
  SwaggerModule.setup('api-' + process.env.SWAGGER_KEY, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      url: "pluto"
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
    transform: true,
    whitelist: true
  }));
  
  initSwagger(app)
  
  await app.listen(process.env.PORT || 4000);
}

bootstrap().then(() => null)
