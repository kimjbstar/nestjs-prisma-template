import { Module } from '@nestjs/common'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

/**
 * ### 파일 모듈
 *
 * 파일 업로드, 다운로드 액션을 관리하는 모듈입니다.
 *
 */
@Module({
	imports: [],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
