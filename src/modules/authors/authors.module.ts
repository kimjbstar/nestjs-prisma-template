import { Module } from '@nestjs/common'
import { AuthorsService } from '@src/modules/authors/authors.service'
import { AuthorsResolver } from './authors.resolver'

/**
 * ### Author 모듈
 *
 * Author 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [AuthorsService, AuthorsResolver],
	exports: [AuthorsService, AuthorsResolver],
})
export class AuthorsModule { }
