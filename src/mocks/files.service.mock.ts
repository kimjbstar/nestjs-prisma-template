import { Injectable } from '@nestjs/common'

type UploadArg = {
	bucket?: string
	path?: string
	fileraw: string | Buffer
	filename: string
}

@Injectable()
export class FilesServiceMock {
	async upload({ bucket, path, fileraw, filename }: UploadArg) {
		return `uploaded-url-${bucket}-${path}-${filename}`
	}
}
