import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UserDocument } from "../users/schemas/user.schema";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schemas/user.schema";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return this.usersService.validateUser(email, password);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      this.logger.warn(`로그인 실패: ${loginDto.email}`);
      return null;
    }

    // 타입스크립트용 타입 단언
    const userDoc = user as any;

    // 토큰 생성
    const { accessToken, refreshToken } = await this.createTokens(user);

    this.logger.log(`로그인 성공: ${loginDto.email}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log("리프레시 토큰 요청 받음:", refreshToken);

      if (!refreshToken) {
        console.log("리프레시 토큰이 제공되지 않음");
        throw new UnauthorizedException("리프레시 토큰이 제공되지 않았습니다.");
      }

      // 리프레시 토큰으로 사용자 찾기
      const user = await this.findByRefreshToken(refreshToken);

      // 토큰 생성
      const { accessToken, refreshToken: newRefreshToken } = await this.createTokens(user);

      this.logger.log(`토큰 갱신 성공: ${user.email}`);

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      this.logger.error(`토큰 갱신 실패: ${error.message}`);
      throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
    }
  }

  // 액세스 토큰과 리프레시 토큰을 생성하는 함수
  private async createTokens(user: any): Promise<TokenPair> {
    // 액세스 토큰 만료 시간 계산
    const jwtExpiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "1h");
    const accessTokenExpires = this.calculateExpiryDate(jwtExpiresIn);

    // 리프레시 토큰 설정 (30일)
    const refreshTokenDuration = this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN", "30d");
    const refreshTokenExpires = this.calculateExpiryDate(refreshTokenDuration);

    // Mongoose 문서 객체에서 데이터 추출
    const userDoc = user as any;
    const userData = userDoc._doc ? userDoc._doc : user;

    // 액세스 토큰 페이로드에 만료 시간 추가
    const payload = {
      sub: userData._id.toString(),
      email: userData.email,
      role: userData.role,
      exp: Math.floor(accessTokenExpires.getTime() / 1000), // JWT 표준은 Unix timestamp(초)로 표현
    };

    // 액세스 토큰 생성
    const accessToken = this.jwtService.sign(payload);

    // 리프레시 토큰 생성
    const refreshToken = await this.generateRefreshToken(userData._id, refreshTokenExpires);

    return { accessToken, refreshToken };
  }

  async validateToken(token: string) {
    try {
      // 토큰 검증
      const payload = this.jwtService.verify(token);
      console.log("검증된 페이로드:", payload);
      this.logger.log(`토큰 검증 성공: ${payload.email || "이메일 없음"}`);

      // 페이로드에 필수 정보가 없으면 사용자 ID로 조회
      if (!payload.role) {
        console.log("토큰에 역할 정보가 없어 사용자 정보를 조회합니다.");
        // 사용자 ID(sub)가 있는지 확인
        if (!payload.sub) {
          throw new UnauthorizedException("토큰에 사용자 ID가 없습니다.");
        }

        // 사용자 정보 조회
        const user = await this.userModel.findById(payload.sub);
        if (!user) {
          throw new UnauthorizedException("존재하지 않는 사용자입니다.");
        }

        // _doc 속성에서 실제 사용자 데이터 추출 (타입 단언 사용)
        const userDoc = user as any;
        const userData = userDoc._doc || user;

        // 사용자 정보 반환
        return {
          sub: userData._id.toString(),
          email: userData.email,
          role: userData.role,
        };
      }

      // 페이로드에 모든 정보가 있으면 그대로 반환
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      this.logger.error(`토큰 검증 실패: ${error.message}`);
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }

  async logout(userId: string) {
    await this.removeRefreshToken(userId);
    this.logger.log(`로그아웃 처리 완료: 사용자 ID ${userId}`);
    return { success: true };
  }

  // 리프레시 토큰 생성
  async generateRefreshToken(userId: string, expireDate: Date): Promise<string> {
    // 랜덤 토큰 생성
    const refreshToken = crypto.randomBytes(40).toString("hex");

    // 사용자 정보 업데이트
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken,
      refreshTokenExpires: expireDate,
    });

    return refreshToken;
  }

  // 리프레시 토큰으로 사용자 찾기
  async findByRefreshToken(refreshToken: string): Promise<User> {
    // 리프레시 토큰으로 사용자 찾기
    const user = await this.userModel.findOne({
      refreshToken,
      refreshTokenExpires: { $gt: new Date() },
    });

    console.log("찾은 사용자:", user ? `ID: ${user._id}, 이메일: ${user.email}` : "사용자 없음");

    return user;
  }

  // 리프레시 토큰 제거 (로그아웃)
  async removeRefreshToken(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenExpires: null,
    });
  }

  // 문자열 형식의 만료 시간을 Date 객체로 변환
  private calculateExpiryDate(expiresInString: string): Date {
    const now = new Date();
    const expiresIn = this.parseExpiresIn(expiresInString);

    if (expiresIn.unit === "s") {
      now.setSeconds(now.getSeconds() + expiresIn.value);
    } else if (expiresIn.unit === "m") {
      now.setMinutes(now.getMinutes() + expiresIn.value);
    } else if (expiresIn.unit === "h") {
      now.setHours(now.getHours() + expiresIn.value);
    } else if (expiresIn.unit === "d") {
      now.setDate(now.getDate() + expiresIn.value);
    }

    return now;
  }

  // JWT expiresIn 문자열 파싱 (예: '1h', '7d', '60m')
  private parseExpiresIn(expiresIn: string): { value: number; unit: string } {
    const regex = /^(\d+)([smhd])$/;
    const match = expiresIn.match(regex);

    if (match) {
      return {
        value: parseInt(match[1], 10),
        unit: match[2],
      };
    }

    // 기본값: 1시간
    return { value: 1, unit: "h" };
  }
}
