import { ApiProperty } from "@nestjs/swagger";

export class RewardRequestDto {
  @ApiProperty({ description: "사용자 ID", example: "60d21b4667d0d8992e610c86" })
  userId: string;

  @ApiProperty({ description: "보상 ID", example: "60d21b4667d0d8992e610c87" })
  rewardId: string;
}

export class RejectRewardRequestDto {
  @ApiProperty({ description: "거절 사유", example: "친구 초대 조건을 충족하지 않았습니다." })
  reason: string;
}
