import { User } from '.prisma/client'
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Session,
	UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiNormalResponse } from '@src/common/decorators/api-normal-response'
import { NormalResult } from '@src/common/dto/responses'
import { PrismaModel } from '@src/_gen/prisma-class'
import { AuthService, LogipastaSessionData } from './auth.service'
import { UtilService } from '../util/util.service'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly utilService: UtilService,
		private readonly prismaService: PrismaService,
	) {}

	@Get('force_login/id/:id')
	async forceLoginByID(
		@Session() session: LogipastaSessionData,
		@Param('id') id: number,
	) {
		if (this.utilService.isLocal() === false) {
			throw new UnauthorizedException('로컬에서만 접근 가능합니다.')
		}
		const user = await this.prismaService.findUniqueUser(id)

		const saved = await this.authService.setUser(session, user)
		return new NormalResult({ user: saved.user })
	}

	@Get('force_login/insung_id/:insungId')
	async forceLoginByInsungId(
		@Session() session: LogipastaSessionData,
		@Param('insungId') insungId: string,
	) {
		if (this.utilService.isLocal() === false) {
			throw new UnauthorizedException('로컬에서만 접근 가능합니다.')
		}
		const user = await this.prismaService.findFirstUser({ insungId }, true)

		const saved = await this.authService.setUser(session, user)
		return new NormalResult({ user: saved.user })
	}

	@Post('logout')
	@ApiNormalResponse({
		description: '로그아웃',
	})
	async destroySession(@Session() sess: LogipastaSessionData) {
		sess.destroy(() => {})
		return new NormalResult({
			message: '로그아웃 되었습니다.',
		})
	}

	@ApiNormalResponse({
		models: {
			user: PrismaModel.User,
		},
		description: '현재 세션정보를 확인합니다.',
	})
	@Get('current')
	async current(
		@Session() session: LogipastaSessionData,
	): Promise<NormalResult> {
		return new NormalResult({
			session,
		})
	}

	@Get('hash')
	async hash(@Query('password') password) {
		if (!password) {
			return new BadRequestException()
		}
		const { hashed, salt } = await this.authService.encrypt(password)
		return new NormalResult({ hashed, salt })
	}
}
