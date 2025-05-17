import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({
    description: "이벤트 제목",
    example: "여름 특별 퀘스트",
  })
  title: string;

  @ApiProperty({
    description: "이벤트 설명",
    example: "여름 테마 퀘스트를 모두 완료하면 한정판 아이템을 받을 수 있습니다.",
  })
  description: string;

  @ApiProperty({
    description: "이벤트 시작일",
    example: "2025-07-01",
  })
  startDate: Date;

  @ApiProperty({
    description: "이벤트 종료일",
    example: "2025-08-31",
  })
  endDate: Date;

  @ApiProperty({
    description: "이벤트 활성화 여부",
    example: true,
  })
  isActive: boolean;
}

export class CreateRewardDto {
  @ApiProperty({
    description: "보상 이름",
    example: "여름 테마 펫",
  })
  name: string;

  @ApiProperty({
    description: "보상 설명",
    example: "여름 스페셜 퀘스트 완료 보상으로 지급되는 한정판 펫입니다.",
  })
  description: string;

  @ApiProperty({
    description: "보상 총 수량",
    example: 30,
  })
  quantity: number;

  @ApiProperty({
    description: "이벤트 ID",
    example: "60d21b4667d0d8992e610c85",
  })
  event: string;
}

export class RewardRequestDto {
  @ApiProperty({
    description: "사용자 ID",
    example: "60d21b4667d0d8992e610c85",
  })
  userId: string;

  @ApiProperty({
    description: "보상 ID",
    example: "60d21b4667d0d8992e610c86",
  })
  rewardId: string;
}

export class RejectRewardRequestDto {
  @ApiProperty({
    description: "거절 사유",
    example: "이미 해당 이벤트의 보상을 받았습니다.",
  })
  reason: string;
}
