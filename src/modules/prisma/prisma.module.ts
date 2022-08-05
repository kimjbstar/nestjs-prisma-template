import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

/**
 * ### prisma 모듈
 *
 * 내부적으로 데이터베이스 연결을 관리하는 모듈입니다.
 *
 */
@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
