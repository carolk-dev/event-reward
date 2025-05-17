import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class AuthService {
  private authServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.authServiceUrl = this.configService.get<string>("AUTH_SERVICE_URL", "http://auth:3001");
  }

  async validateUser(payload: any) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/validate`, { payload });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: any) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/login`, loginDto);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async register(registerDto: any) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/register`, registerDto);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
