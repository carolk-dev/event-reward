import { ApiProperty } from "@nestjs/swagger";

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
