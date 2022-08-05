import { Injectable } from '@nestjs/common'
import axios from 'axios'
import FormData from 'form-data'

type UploadArg = {
	bucket?: string
	path?: string
	fileraw: string | Buffer
	filename: string
}

@Injectable()
export class FilesService {
	async upload({ bucket, path, fileraw, filename }: UploadArg) {
		const url = `https://refrigerator.logipasta.com/v1/file`
		const form = new FormData()

		if (bucket) {
			form.append('bucket', bucket)
		}
		if (path) {
			form.append('path', path)
		}
		form.append('file', fileraw, filename)

		const { data } = await axios.post<{ file: string }>(url, form, {
			headers: form.getHeaders(),
		})

		return data.file
	}
}
