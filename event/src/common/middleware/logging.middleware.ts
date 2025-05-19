import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent") || "";
    const startTime = Date.now();

    // 요청 시작 시 로그
    this.logger.log(`[EVENT-SERVICE] [시작] ${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`);

    // 응답 완료 후 로그를 위한 이벤트 리스너
    res.on("finish", () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      const logMessage = `[EVENT-SERVICE] [종료] ${method} ${originalUrl} - 상태: ${statusCode} - 처리시간: ${responseTime}ms - IP: ${ip}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
