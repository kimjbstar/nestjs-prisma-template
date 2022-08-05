/**
 * 마이그레이션 생성 시, 다음과 같은 형식으로 생성 됨
 * ex) 20210430045127_init/migration.sql
 * git에서 branch 이동 시, migration.sql 파일만 관리해주고 디렉터리가 남아있는 케이스가 있음
 * 해당 소스는 prisma/migrations 디렉터리 아래에 있는 빈 디렉터리를 정리해주는 스크립트임
 * */

const fs = require('fs')

const migrationDirs = fs
	.readdirSync('./prisma/migrations')
	.filter((discriptors) => {
		return discriptors.match(/[0-9]{14}/) !== null
	})

migrationDirs.forEach((migrationDir) => {
	const migirationPath = `./prisma/migrations/${migrationDir}`
	const { length } = fs.readdirSync(migirationPath)

	if (length === 0) {
		console.log(`REMOVE ${migirationPath}`)
		fs.rmdirSync(migirationPath)
	}
})

console.log('COMPLETE')
