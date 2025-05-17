import { Controller, Get, Param, Post, UseGuards, Body, Put, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "모든 사용자 조회", description: "시스템의 모든 사용자를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "사용자 조회", description: "특정 ID의 사용자를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: "이메일로 사용자 조회", description: "이메일로 사용자 정보를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Get("email/:email")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findByEmail(@Param("email") email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: "사용자 정보 수정", description: "사용자 정보를 수정합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "수정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "사용자 삭제", description: "사용자를 삭제합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "삭제 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: "사용자 역할 설정", description: "특정 사용자의 역할을 설정합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "역할 설정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Post(":id/roles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  setRole(@Param("id") id: string, @Body() roleData: { role: string }) {
    return this.usersService.setRole(id, roleData.role);
  }
}
