import { User } from ".prisma/client";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Session,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiNormalResponse } from "@src/common/decorators/api-normal-response";
import {
  ApiDeleteOperation,
  ApiReadListOperation,
  ApiReadSingleOperation,
} from "@src/common/decorators/crud-operations";
import { NormalResult, PaginatedResult } from "@src/common/dto/responses";
import { ListResponse } from "@src/common/base.repository";
import { UserLoginDto } from "@src/modules/users/dtos/user-login.dto";
import { UsersService } from "@src/modules/users/users.service";
import { PrismaModel } from "@src/_gen/prisma-class";
import { UserListArgs } from "./args/user-list.args";
import { CurrentUser } from "@src/common/decorators/current-user";
import { ApplicationSessionData } from "../auth/auth.service";
import { UserResponse } from "./response/user.response";
import { BaseDTOProperty } from "@src/common/decorators/dto-types";
import { UtilService } from "../util/util.service";

export class AuthWhoamiQuery {
  @BaseDTOProperty({
    dataType: "BOOLEAN",
    description: "유저 조회 시 새로고침 여부",
  })
  is_refresh: boolean = false;
}

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilService: UtilService
  ) {}

  @Get("whoami")
  @ApiNormalResponse({
    description: "현재 세션 조회",
  })
  async whoami(
    @Session() session: ApplicationSessionData,
    @CurrentUser() user,
    @Query() query: AuthWhoamiQuery
  ) {
    let result = user;

    if (query.is_refresh) {
      result = await this.usersService.findByPk(user.id);
      session.user = this.usersService.summarize(result);
      session.save();
    }

    return new NormalResult({ user: result });
  }

  @Post("login")
  @ApiNormalResponse({
    description: "로그인",
  })
  async login(
    @Body() dto: UserLoginDto,
    @Session() session: ApplicationSessionData
  ): Promise<NormalResult> {
    const user = await this.usersService.login({
      email: dto.email,
      password: dto.password,
    });

    session.user = this.usersService.summarize(user);
    session.save();

    return new NormalResult({ user: session.user });
  }

  @Get("force_login/:id")
  async forceLoginByID(
    @Session() session: ApplicationSessionData,
    @Param("id") id: string
  ) {
    if (this.utilService.isLocal() === false) {
      throw new UnauthorizedException("로컬에서만 접근 가능합니다.");
    }
    const user = await this.usersService.findByPk(id);
    session.user = user;
    session.save();

    return new NormalResult({ user });
  }

  @Post("logout")
  @ApiNormalResponse({
    description: "로그아웃",
  })
  async destroySession(@Session() sess: ApplicationSessionData) {
    sess.destroy(() => {});
    return new NormalResult({
      message: "로그아웃 되었습니다.",
    });
  }

  @Get("aggregate")
  async aggregate(@Query() args: UserListArgs) {
    const result = await this.usersService.aggregate(args);
    return new NormalResult({ result });
  }

  @ApiReadListOperation(PrismaModel.User)
  async find(@Query() args: UserListArgs): Promise<PaginatedResult<User>> {
    const result = await this.usersService.findMany(args);
    return ListResponse(result, "users");
  }

  @ApiReadSingleOperation(PrismaModel.User)
  async get(@Param("id") id: string): Promise<UserResponse> {
    return {
      user: await this.usersService.findByPk(id),
    };
  }

  @ApiDeleteOperation(PrismaModel.User)
  async delete(@Param("id") id: string): Promise<void> {
    await this.usersService.destroy(id);
  }
}
