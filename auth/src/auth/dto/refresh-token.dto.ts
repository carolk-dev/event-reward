import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({
    example: "7f4e3d2c1b0a...",
    description: "리프레시 토큰",
  })
  refreshToken: string;
}
