import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "admin@example.com",
    description: "사용자 이메일",
  })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "사용자 비밀번호",
  })
  password: string;
}
