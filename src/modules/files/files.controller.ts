import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { NormalResult } from '@src/common/dto/responses'
import { FilesService } from './files.service'

@ApiTags('files')
@Controller('files')
export class FilesController {
	constructor(private readonly fileService: FilesService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadedFile(@UploadedFile() file): Promise<NormalResult> {
		const url = await this.fileService.upload({
			fileraw: file.buffer,
			filename: file.originalname,
		})

		return new NormalResult({ url })
	}
}
