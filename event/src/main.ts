import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle("Event API")
    .setDescription("Event 서비스 API 문서")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  // 전역 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS 설정
  app.enableCors();

  const port = process.env.PORT || 3002;
  await app.listen(port);

  Logger.log(`Event 서비스가 포트 ${port}에서 실행 중입니다.`);
}
bootstrap();
