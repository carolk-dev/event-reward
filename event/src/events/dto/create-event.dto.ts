import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({ description: "이벤트 제목", example: "7일 연속 출석 이벤트" })
  title: string;

  @ApiProperty({
    description: "이벤트 설명",
    example: "7일 연속으로 앱에 로그인하면 특별 보상을 받을 수 있습니다.",
    required: false,
  })
  description?: string;

  @ApiProperty({ description: "이벤트 시작일", example: "2023-05-01T00:00:00Z" })
  startDate: Date;

  @ApiProperty({ description: "이벤트 종료일", example: "2023-06-30T23:59:59Z" })
  endDate: Date;

  @ApiProperty({ description: "이벤트 활성화 여부", example: true, default: true, required: false })
  isActive?: boolean;
}
