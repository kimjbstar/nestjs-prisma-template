import { BaseDTOProperty } from "@src/common/decorators/dto-types";
import { Length } from "class-validator";

export class UserLoginDto {
  @BaseDTOProperty({
    isRequired: true,
    description: "이메일",
  })
  email: string = undefined;

  @BaseDTOProperty({
    isRequired: true,
    description: "비밀번호",
  })
  password: string = undefined;
}
