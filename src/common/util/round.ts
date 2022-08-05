export default function round(src: number, by: number, type: string) {
	const powNumber = Math.pow(10, by)
	if (type === 'DOWN') {
		return Math.floor(src / powNumber) * powNumber
	}
	if (type === 'UP') {
		return Math.ceil(src / powNumber) * powNumber
	}
	return Math.round(src / powNumber) * powNumber
}
