import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "사용자 이메일",
    example: "admin@example.com",
  })
  email: string;

  @ApiProperty({
    description: "사용자 비밀번호",
    example: "password123",
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: "사용자 이름",
    example: "new_user",
  })
  username: string;

  @ApiProperty({
    description: "사용자 이메일",
    example: "newuser@example.com",
  })
  email: string;

  @ApiProperty({
    description: "사용자 비밀번호",
    example: "password123",
  })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: "리프레시 토큰",
    example: "7f4e3d2c1b0a...",
  })
  refreshToken: string;
}
