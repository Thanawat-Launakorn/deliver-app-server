import * as path from 'path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

export const LOCALHOST = 'http://localhost:3000/';
const whitelist = [LOCALHOST, 'http://localhost:8080'];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      origin: function (origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        console.log('origin', origin);
        if (
          whitelist.includes(origin) || // Checks your whitelist
          !!origin.match(/yourdomain\.com$/) // Overall check for your domain
        ) {
          // console.log('allowd cors for:', origin);
          callback(null, true);
        } else {
          // console.log('blocked cors for:', origin);
        }
      },
    },
  });

  app.useStaticAssets(path.join(__dirname, '../uploads'));

  await app.listen(3000);
}
bootstrap();
