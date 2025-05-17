import { Injectable, HttpException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError } from "axios";

@Injectable()
export class AuthService {
  private authServiceUrl: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {
    this.authServiceUrl = this.configService.get<string>("AUTH_SERVICE_URL");
    this.logger.log(`Auth service URL: ${this.authServiceUrl}`);
  }

  // 에러 핸들링 헬퍼 메서드
  private handleError(error: any) {
    this.logger.error(`Auth service error: ${error.message}`, error.stack);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      const data = axiosError.response?.data || { message: "Auth service internal error" };

      // 로그에 자세한 에러 정보 출력
      this.logger.error(`Status: ${status}, Response: ${JSON.stringify(data)}`);

      // 원본 상태 코드와 에러 메시지 유지
      throw new HttpException(data, status);
    }

    // 기타 에러
    throw new HttpException(error.message || "Unknown error", 500);
  }

  async validateUser(token: any) {
    try {
      // token이 payload 자체인 경우(JWT 전략에서 디코딩된 페이로드)
      if (token && typeof token === "object") {
        return token;
      }

      // token이 문자열인 경우(원시 JWT 토큰)
      const response = await axios.post(`${this.authServiceUrl}/auth/validate`, { payload: token });
      return response.data;
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message || error}`);
      // 토큰 검증 오류는 null을 반환하도록 유지 (가드에서 처리)
      return null;
    }
  }

  async login(loginDto: any) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/login`, loginDto);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(createUserDto: any) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/register`, createUserDto);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // 토큰 갱신 메서드
  async refreshToken(refreshToken: string) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/refresh`, { refreshToken });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // 로그아웃 메서드
  async logout(userId: string) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/logout`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // 사용자 관리 API
  async getAllUsers() {
    try {
      const response = await axios.get(`${this.authServiceUrl}/users`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserById(id: string) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/users/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/users/email/${email}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUser(userId: string, userData: any) {
    try {
      const response = await axios.put(`${this.authServiceUrl}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await axios.delete(`${this.authServiceUrl}/users/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async setUserRole(userId: string, role: string) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/users/${userId}/roles`, { role });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
