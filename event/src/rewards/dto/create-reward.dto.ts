export class CreateRewardDto {
  name: string;
  description?: string;
  quantity: number;
  event: string; // 이벤트 ID
} 