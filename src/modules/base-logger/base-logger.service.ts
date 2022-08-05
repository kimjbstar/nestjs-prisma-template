import { Global, Injectable, Logger, LoggerService } from '@nestjs/common'
import * as fs from 'fs'
import moment from 'moment'
import * as path from 'path'
import { Request, Response } from 'express'

export type BaseLoggerLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose'

@Injectable()
export class BaseLoggerService implements LoggerService {
	private readonly logger: Logger
	constructor() {
		this.logger = new Logger('BaseLoggerService')
	}

	handler(level: BaseLoggerLevel, message: string, dirPath = 'logs') {
		const text = [
			`[${process.pid}]`,
			`[${Logger.getTimestamp()}]`,
			`[${level}]`,
			message,
		].join('\t')

		const logDirPath = path.join(process.cwd(), dirPath)
		if (!fs.existsSync(logDirPath)) {
			fs.mkdirSync(logDirPath, { recursive: true })
		}

		const logFilePath = path.join(
			logDirPath,
			`${moment().format('YYYYMMDD')}.log`,
		)
		fs.appendFileSync(logFilePath, text + '\r\n')
	}

	log(message: string, dirPath?) {
		this.handler('log', message, dirPath)
		this.logger.log(message)
	}

	error(message: string, dirPath?) {
		this.handler('error', message, dirPath)
		this.logger.error(message, '')
	}

	warn(message: string, dirPath?) {
		this.handler('warn', message, dirPath)
		this.logger.warn(message)
	}

	debug(message: string, dirPath?) {
		this.handler('debug', message, dirPath)
		this.logger.debug(message)
	}

	verbose(message: string, dirPath?) {
		this.handler('verbose', message, dirPath)
		this.logger.verbose(message)
	}

	writeInvalidInsungResult(url: string, message: string) {
		this.handler(
			'error',
			message,
			'logs/invalid/' + url.replace(/\//g, '.'),
		)
		this.logger.error(message)
	}

	logRequest(req: Request) {
		this.log(`METHOD : ${req.method}`)
		this.log(`QUERY : ${req.query}`)
		this.log(`BODY : ${JSON.stringify(req?.body)}`)
		this.log(`IP : ${req.ip}`)
	}
}
