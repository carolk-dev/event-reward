import { ApiProperty } from "@nestjs/swagger";

export class UpdateEventDto {
  @ApiProperty({
    description: "이벤트 제목",
    example: "업데이트된 여름 특별 이벤트",
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: "이벤트 설명",
    example: "업데이트된 설명: 여름 시즌 한정 특별 이벤트입니다. 다양한 미션을 완료하고 보상을 받아가세요!",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "이벤트 시작일",
    example: "2024-07-01T00:00:00Z",
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    description: "이벤트 종료일",
    example: "2024-08-31T23:59:59Z",
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: "이벤트 활성화 여부",
    example: true,
    required: false,
  })
  isActive?: boolean;
}
