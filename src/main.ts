import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(config.get('PORT') ?? 3000);
}
void bootstrap();
