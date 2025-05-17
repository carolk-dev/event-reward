import { ApiProperty } from "@nestjs/swagger";

export class CreateRewardDto {
  @ApiProperty({ description: "보상 이름", example: "프리미엄 화폐 1000개" })
  name: string;

  @ApiProperty({
    description: "보상 설명",
    example: "게임 내 화폐입니다. 아이템 구매나 강화에 사용할 수 있습니다.",
    required: false,
  })
  description?: string;

  @ApiProperty({ description: "보상 총 수량", example: 100 })
  quantity: number;

  @ApiProperty({ description: "이벤트 ID", example: "60d21b4667d0d8992e610c85" })
  event: string; // 이벤트 ID
}
