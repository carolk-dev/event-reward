import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserRole } from "../common/constants/roles";

@ApiTags("Events")
@ApiBearerAuth()
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: "이벤트 생성", description: "새로운 이벤트를 생성합니다." })
  @ApiResponse({ status: 201, description: "이벤트가 성공적으로 생성되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자입니다." })
  @ApiResponse({ status: 403, description: "권한이 없습니다." })
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({ summary: "모든 이벤트 조회", description: "모든 이벤트 목록을 조회합니다." })
  @ApiResponse({ status: 200, description: "이벤트 목록이 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자입니다." })
  @ApiResponse({ status: 403, description: "권한이 없습니다." })
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({ summary: "활성화된 이벤트 조회", description: "현재 활성화된 이벤트 목록을 조회합니다." })
  @ApiResponse({ status: 200, description: "활성화된 이벤트 목록이 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자입니다." })
  @ApiResponse({ status: 403, description: "권한이 없습니다." })
  @Get("active")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async findActive() {
    return this.eventsService.findActive();
  }

  @ApiOperation({ summary: "특정 이벤트 조회", description: "ID로 특정 이벤트를 조회합니다." })
  @ApiResponse({ status: 200, description: "이벤트가 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자입니다." })
  @ApiResponse({ status: 403, description: "권한이 없습니다." })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없습니다." })
  @Get(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: "이벤트 수정", description: "특정 이벤트 정보를 수정합니다." })
  @ApiResponse({ status: 200, description: "이벤트가 성공적으로 수정되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자입니다." })
  @ApiResponse({ status: 403, description: "권한이 없습니다." })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없습니다." })
  @Put(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async update(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: "이벤트 삭제", description: "특정 이벤트를 삭제합니다." })
  @ApiResponse({ status: 200, description: "이벤트가 성공적으로 삭제되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자입니다." })
  @ApiResponse({ status: 403, description: "권한이 없습니다." })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없습니다." })
  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }
}
