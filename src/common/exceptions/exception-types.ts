/** 발생할 수 있는 에러 타입 */
export enum ExceptionType {
	/** 커스텀 정의한 에러 발생 */
	CUSTOM = 'CUSTOM',
	/** 데이터베이스 레코드 조회 실패 */
	PRISMA_NOT_FOUND = 'PRISMA_NOT_FOUND',
	/** 기본 */
	DEFAULT = 'DEFAULT',
	/** 프리즈마 클라이언트 */
	PRISMA_CLIENT_KNOWN = 'PRISMA_CLIENT_KNOWN',
	/** 프리즈마 클라이언트 */
	PRISMA_CLIENT_VALIDATION = 'PRISMA_CLIENT_VALIDATION',
}

export default ExceptionType
