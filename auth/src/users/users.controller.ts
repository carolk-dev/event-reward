import { Controller, Get, Param, Post, UseGuards, Body, Put, Delete, Query } from "@nestjs/common";
import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dto/update-user.dto";
import { SetRoleDto } from "./dto/set-role.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from "@nestjs/swagger";
import { UserRole } from "../common/constants/roles";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "사용자 조회",
    description: "모든 사용자를 조회하거나 이메일로 특정 사용자를 조회합니다. (관리자 전용)",
  })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @ApiQuery({ name: "email", required: false, description: "조회할 사용자의 이메일" })
  @Get()
  async findAll(@Query("email") email?: string) {
    if (email) {
      return this.usersService.findByEmail(email);
    }
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "사용자 조회", description: "특정 ID의 사용자를 조회합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: "사용자 정보 수정", description: "사용자 정보를 수정합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "수정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Put(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "사용자 삭제", description: "사용자를 삭제합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "삭제 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: "사용자 역할 설정", description: "특정 사용자의 역할을 설정합니다. (관리자 전용)" })
  @ApiResponse({ status: 200, description: "역할 설정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @ApiBody({
    type: SetRoleDto,
    description: "설정할 사용자 역할",
    examples: {
      user: {
        value: { role: UserRole.USER },
        summary: "일반 사용자",
      },
      operator: {
        value: { role: UserRole.OPERATOR },
        summary: "운영자",
      },
      admin: {
        value: { role: UserRole.ADMIN },
        summary: "관리자",
      },
      auditor: {
        value: { role: UserRole.AUDITOR },
        summary: "감사자",
      },
    },
  })
  @Post(":id/roles")
  setRole(@Param("id") id: string, @Body() roleDto: SetRoleDto) {
    return this.usersService.setRole(id, roleDto.role);
  }
}
