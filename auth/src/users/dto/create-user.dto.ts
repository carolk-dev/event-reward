import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "사용자 이름",
    example: "new_user",
    required: true,
  })
  username: string;

  @ApiProperty({
    description: "사용자 이메일",
    example: "newuser@example.com",
    required: true,
  })
  email: string;

  @ApiProperty({
    description: "사용자 비밀번호",
    example: "password123",
    required: true,
  })
  password: string;

  @ApiProperty({
    description: "사용자 역할 (기본값: user)",
    example: "user",
    required: false,
    default: "user",
  })
  role?: string;
}
