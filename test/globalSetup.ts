module.exports = async () => {
	const execSync = require('child_process').execSync
	process.env.NODE_ENV = 'test'
	const result = execSync(
		'dotenv -e .env.test -- npx prisma migrate reset --force',
		// 'dotenv -e .env.test -- npx prisma migrate deploy',

		// CLEAN AND deploy
	).toString()
	// console.log(result)
}
