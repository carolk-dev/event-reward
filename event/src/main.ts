import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3002;
  
  // 전역 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // CORS 설정
  app.enableCors();
  
  await app.listen(port);
  Logger.log(`Event 서비스가 ${port} 포트에서 실행 중입니다.`);
}
bootstrap(); 