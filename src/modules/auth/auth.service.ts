import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Administrator, UserCreditType } from '@prisma/client'
import {
	AdministratorWithRelation,
	UserWithRelation,
} from '@src/common/types/prisma'
import { SessionData } from '@src/common/types/session'
import * as crypto from 'crypto'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'

export interface SessionUser {
	id?: number
	insungId?: string
	name?: string
	phone?: string
	department?: string
	position?: string
	companyId?: number
	shipperId?: number
	cCode?: string
	administratorId?: number
	defaultDepartureId?: number
	defaultArrivalId?: number
	address?: string
	detail?: string
	currentMileage?: number
	creditType?: UserCreditType
}

export type LogipastaSessionData = SessionData<{
	user?: SessionUser
	administrator?: Partial<Administrator>
}>

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}
	static ENCRYPT_KEYLEN = 32 as const
	static ENCRYPT_ITERATION = 100 as const
	static ENCRYPT_ALGORITHM = 'sha512' as const

	/** 패스워드 -> hash, salt 리턴 */
	async encrypt(password: string): Promise<{ salt: string; hashed: string }> {
		const salt = (
			await crypto.randomBytes(AuthService.ENCRYPT_KEYLEN)
		).toString('hex')
		const hashed = await this.pbkdf2(salt, password)
		return {
			salt,
			hashed,
		}
	}

	async pbkdf2(salt: string, password: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				crypto.pbkdf2(
					password,
					salt,
					AuthService.ENCRYPT_ITERATION,
					AuthService.ENCRYPT_KEYLEN,
					AuthService.ENCRYPT_ALGORITHM,
					(err, derivedKey) => {
						if (err) throw err
						const hashed = derivedKey.toString('hex')
						resolve(hashed)
					},
				)
			} catch (err) {
				console.log(err)
				reject(err)
			}
		})
	}

	setAdministrator(
		session: LogipastaSessionData,
		administrator: Partial<AdministratorWithRelation>,
	): LogipastaSessionData {
		session.administrator = administrator
		if (administrator.user) {
			session.user = administrator.user
		}
		session.save()
		return session
	}

	async setUser(
		session: LogipastaSessionData,
		_user: Partial<UserWithRelation>,
	): Promise<LogipastaSessionData> {
		const user = this.usersService.summarize(_user)
		session.user = user
		if (user.administratorId) {
			const administrator =
				await this.prismaService.findUniqueAdministrator(
					user.administratorId,
				)
			session.administrator = administrator
		}
		session.save()
		return session
	}

	async clear(session: LogipastaSessionData) {
		session.destroy(() => {})
	}

	issueToken(user: UserWithRelation): string {
		const payload = {
			id: user.id,
			cCode: user.unqId.replace('INSUNG-', ''),
		}
		return this.jwtService.sign(payload)
	}

	verifyToken(token: string): {
		id: number
		cCode: string
	} {
		try {
			return this.jwtService.verify(token)
		} catch (e) {
			throw new UnauthorizedException(e.message)
		}
	}
}
