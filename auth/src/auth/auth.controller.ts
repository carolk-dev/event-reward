import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "로그인" })
  @ApiResponse({ status: 200, description: "로그인 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: "회원가입" })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 409, description: "이미 등록된 이메일" })
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: "토큰 갱신" })
  @ApiResponse({ status: 200, description: "토큰 갱신 성공" })
  @ApiResponse({ status: 401, description: "유효하지 않은 리프레시 토큰" })
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: "토큰 검증" })
  @ApiResponse({ status: 200, description: "토큰 검증 성공" })
  @ApiResponse({ status: 401, description: "유효하지 않은 토큰" })
  @Post("validate")
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() body: { payload: string }) {
    return this.authService.validateToken(body.payload);
  }

  @ApiOperation({ summary: "로그아웃" })
  @ApiResponse({ status: 200, description: "로그아웃 성공" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req) {
    return this.authService.logout(req.user.sub);
  }
}
