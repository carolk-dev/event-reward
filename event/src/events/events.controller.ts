import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

@ApiTags("Events")
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: "이벤트 생성", description: "새로운 이벤트를 생성합니다." })
  @ApiResponse({ status: 201, description: "이벤트가 성공적으로 생성되었습니다." })
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: "이벤트 조회",
    description: "모든 이벤트 목록을 조회하거나 활성화된 이벤트만 필터링하여 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "이벤트 목록이 성공적으로 조회되었습니다." })
  @ApiQuery({
    name: "active",
    required: false,
    type: Boolean,
    description: "활성화된 이벤트만 조회할지 여부(true/false)",
  })
  @Get()
  async findAll(@Query("active") active?: string) {
    // active 파라미터가 true일 경우 활성화된 이벤트만 반환
    if (active === "true") {
      return this.eventsService.findActive();
    }
    // active 파라미터가 false일 경우 비활성화된 이벤트만 반환
    if (active === "false") {
      return this.eventsService.findInactive();
    }
    // 그 외의 경우 모든 이벤트 반환
    return this.eventsService.findAll();
  }

  @ApiOperation({ summary: "특정 이벤트 조회", description: "ID로 특정 이벤트를 조회합니다." })
  @ApiResponse({ status: 200, description: "이벤트가 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없습니다." })
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: "이벤트 수정", description: "특정 이벤트 정보를 수정합니다." })
  @ApiResponse({ status: 200, description: "이벤트가 성공적으로 수정되었습니다." })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없습니다." })
  @Put(":id")
  async update(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: "이벤트 삭제", description: "특정 이벤트를 삭제합니다." })
  @ApiResponse({ status: 200, description: "이벤트가 성공적으로 삭제되었습니다." })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없습니다." })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }
}
