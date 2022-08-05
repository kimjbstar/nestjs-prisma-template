import { Global, Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { PrismaService } from '../prisma/prisma.service'
import { SeedService } from './seed.service'

/**
 * ### seed 모듈
 *
 * seed 모듈입니다.
 *
 */
@Module({
	imports: [PrismaModule],
	controllers: [],
	providers: [SeedService, PrismaService],
	exports: [SeedService],
})
export class SeedModule {}
