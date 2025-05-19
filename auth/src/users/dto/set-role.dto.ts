import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../../common/constants/roles";

export class SetRoleDto {
  @ApiProperty({
    description: "설정할 사용자 역할",
    enum: UserRole,
    enumName: "UserRole",
    example: UserRole.USER,
  })
  @IsNotEmpty({ message: "역할은 필수 입력값입니다." })
  @IsEnum(UserRole, { message: "유효하지 않은 역할입니다." })
  role: UserRole;
}
