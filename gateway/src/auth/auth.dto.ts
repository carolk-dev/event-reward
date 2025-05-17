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

export class CreateUserDto {
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

export class UpdateUserDto {
  @ApiProperty({
    description: "사용자 이름",
    example: "updated_username",
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: "사용자 이메일",
    example: "updated_email@example.com",
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: "사용자 비밀번호",
    example: "newpassword123",
    required: false,
  })
  password?: string;
}
