import { Body, Controller, Post, HttpCode, HttpStatus, Get, Param, UseGuards, Req, Put, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/constants/roles";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { LoginDto, CreateUserDto, UpdateUserDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "로그인", description: "사용자 이메일과 비밀번호로 로그인합니다." })
  @ApiResponse({ status: 200, description: "로그인 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: "회원가입", description: "새로운 사용자를 등록합니다." })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: "토큰 갱신", description: "리프레시 토큰을 사용하여 새 액세스 토큰을 발급합니다." })
  @ApiResponse({ status: 200, description: "토큰 갱신 성공" })
  @ApiResponse({ status: 401, description: "유효하지 않은 리프레시 토큰" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          example: "7f4e3d2c1b0a...",
          description: "리프레시 토큰",
        },
      },
    },
  })
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}

@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "모든 사용자 조회", description: "시스템의 모든 사용자를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @ApiOperation({ summary: "사용자 조회", description: "특정 ID의 사용자를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserById(@Param("id") id: string) {
    return this.authService.getUserById(id);
  }

  @ApiOperation({ summary: "이메일로 사용자 조회", description: "이메일로 사용자 정보를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Get("email/:email")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserByEmail(@Param("email") email: string) {
    return this.authService.getUserByEmail(email);
  }

  @ApiOperation({ summary: "사용자 정보 수정", description: "사용자 정보를 수정합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "수정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: "사용자 삭제", description: "사용자를 삭제합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "삭제 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param("id") id: string) {
    return this.authService.deleteUser(id);
  }

  @ApiOperation({ summary: "사용자 역할 설정", description: "특정 사용자의 역할을 설정합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "역할 설정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Post(":id/roles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setUserRole(@Param("id") id: string, @Body() roleData: { role: string }) {
    return this.authService.setUserRole(id, roleData.role);
  }
}
