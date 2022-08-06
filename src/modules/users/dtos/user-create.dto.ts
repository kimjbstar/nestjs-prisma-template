import { BaseDTOProperty } from '@src/common/decorators/dto-types'
import { AssignableClass } from '@src/common/dto/responses'

export class UserCreateDto extends AssignableClass {
	@BaseDTOProperty({
		isRequired: true,
		description: '인성데이타 ID',
	})
	insung_id: string = undefined

	@BaseDTOProperty({
		isRequired: true,
		description: '비밀번호',
	})
	password: string = undefined

	@BaseDTOProperty({
		isRequired: true,
		description: '이름',
	})
	name: string = undefined

	@BaseDTOProperty({
		isRequired: true,
		description: '연락처',
	})
	phone: string = undefined

	@BaseDTOProperty({
		isRequired: true,
		description: '주소',
	})
	address: string = undefined

	@BaseDTOProperty({
		description: '상세 주소',
	})
	detail?: string = undefined

	@BaseDTOProperty({
		description: '기업 회원가입을 위해 주선사에서 전달 받은 토큰',
	})
	shipper_token?: string = undefined

	@BaseDTOProperty({
		description: '부서명',
	})
	department?: string = undefined

	@BaseDTOProperty({
		description: '직급',
	})
	position?: string = undefined
}
