import { ApiProperty } from "@nestjs/swagger";

export enum RewardRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

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

export class UpdateRewardDto {
  @ApiProperty({
    description: "보상 이름",
    example: "한정판 여름 이벤트 아이템",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "보상 설명",
    example: "2024년 여름 이벤트 참여 보상으로 제공되는 한정판 아이템입니다.",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "보상 총 수량",
    example: 150,
    required: false,
  })
  quantity?: number;
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
