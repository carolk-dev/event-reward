import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle("Gateway API")
    .setDescription("Gateway 서비스 API 문서")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || 3000;
  app.enableCors();

  await app.listen(port);
  Logger.log(`Gateway 서비스가 ${port} 포트에서 실행 중입니다.`);
}
bootstrap();
