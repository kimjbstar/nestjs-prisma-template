/**
 * 해당 번호가 문자를 수신 할 수 있는 전화번호인지 확인합니다.
 * 카카오톡이나 SMS
 * @param phone
 */
export function isMessageSendablePhoneNumber(phone: string) {
	// 하이푼 제거
	phone = phone.replace(/[-]/g, '')

	/**
	 * 010 으로 시작하고
	 * 추가숫자 8자로 끝나는지 확인하는 정규식
	 */
	const regex = /^(010)[0-9]{8}$/

	return phone.match(regex) !== null
}
