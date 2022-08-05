function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = async () => {
	const MAX_TRIES = 10
	const childProcess = require('child_process')
	process.env.NODE_ENV = 'test'
	console.log(`Check Database ...`)

	// 없을 시 추가
	if (
		!childProcess
			.execSync(`docker compose ls -q`)
			.toString()
			.includes('test')
	) {
		const dockerCompseUpResult = childProcess.execSync(
			`docker compose -f ./test/docker-compose.yml up -d --remove-orphans`,
		)
		console.log(dockerCompseUpResult.toString())
	} else {
		console.log('container already exists!')
	}

	let tries = 0
	while (tries++ < MAX_TRIES) {
		try {
			childProcess.execSync(
				`yarn prisma:test db push --accept-data-loss > /dev/null`,
			)
			break
		} catch (e) {
			console.log('Testing Database Currently Not Setted. Wait...')
			await sleep(4000)
		}
	}
	console.log('😎 Global Setup Done! Ready To Test!')
}
