import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  
  await app.listen(port);
  Logger.log(`Gateway 서비스가 ${port} 포트에서 실행 중입니다.`);
}
bootstrap(); 