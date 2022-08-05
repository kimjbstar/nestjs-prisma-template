import { applyDecorators } from '@nestjs/common'
import {
	ApiProperty,
	ApiPropertyOptional,
	ApiPropertyOptions,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsDateString,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { EmptyToNull } from './empty-to-null'
import { ToBoolean } from './to-boolean'
import { ToNumber } from './to-number'

/**
 * 공통 DTO 데코레이터 입니다.
 * @param isRequired 필수 여부
 * @param dataType 데이터 형태 NUMBER
		| STRING
		| ENUM
		| JSON
		| BOOLEAN
		| ARRAY
		| ARRAY_OF_NUMBER
		| ARRAY_OF_CLASS
		| CLASS
		| ARRAY_OF_ENUM
		| UNKNOWN
	@param value ENUM, CLASS 등 추가 데이터 정의
	@param example API 문서에 표기될 기본값
	@param deprecated deprecated 여부
	@param default 기본값
 * @returns
 */
export const BaseDTOProperty = (input: {
	isRequired?: boolean
	dataType?:
		| 'NUMBER'
		| 'STRING'
		| 'ENUM'
		| 'JSON'
		| 'BOOLEAN'
		| 'ARRAY'
		| 'ARRAY_OF_NUMBER'
		| 'ARRAY_OF_CLASS'
		| 'CLASS'
		| 'ARRAY_OF_ENUM'
		| 'UNKNOWN'
		| 'DATE'
	description?: string
	example?: string
	value?: any
	deprecated?: boolean
	default?: any
}) => {
	const {
		isRequired = false,
		dataType = 'STRING',
		description,
		example,
		value,
		deprecated,
		default: defaultValue,
	} = input
	const decorators: Array<
		ClassDecorator | MethodDecorator | PropertyDecorator
	> = []
	const apiPropertyOptions: ApiPropertyOptions = {
		title: description,
		description: `${isRequired ? '<b>' : ''}${description}${
			isRequired ? '</b>' : ''
		}`,
		example: example,
		deprecated: deprecated,
		default: defaultValue,
	}
	if (dataType === 'STRING') {
		decorators.push(IsString())
		apiPropertyOptions.type = String
	} else if (dataType === 'NUMBER') {
		decorators.push(ToNumber())
		decorators.push(IsNumber())
		apiPropertyOptions.type = Number
	} else if (dataType === 'ENUM') {
		decorators.push(IsIn(Object.values(value)))
		apiPropertyOptions.enum = Object.values(value)
		apiPropertyOptions.type = value
	} else if (dataType === 'BOOLEAN') {
		decorators.push(IsBoolean())
		decorators.push(ToBoolean())
		apiPropertyOptions.type = Boolean
	} else if (dataType === 'CLASS') {
		decorators.push(ValidateNested({ each: true }))
		decorators.push(Type(() => value))
		apiPropertyOptions.type = value
	} else if (dataType === 'ARRAY') {
		decorators.push(IsArray())
	} else if (dataType === 'ARRAY_OF_NUMBER') {
		decorators.push(IsArray())
		decorators.push(IsNumber({}, { each: true }))
		decorators.push(Type(() => Number))
		apiPropertyOptions.type = [Number]
	} else if (dataType === 'ARRAY_OF_ENUM') {
		decorators.push(IsArray())
		decorators.push(IsIn(Object.values(value), { each: true }))
		apiPropertyOptions.enum = Object.values(value)
		apiPropertyOptions.type = [value]
	} else if (dataType === 'ARRAY_OF_CLASS') {
		decorators.push(IsArray())
		decorators.push(ValidateNested({ each: true }))
		decorators.push(Type(() => value))
		apiPropertyOptions.type = [value]
	} else if (dataType === 'DATE') {
		decorators.push(IsDate())
		decorators.push(ValidateNested({ each: true }))
		decorators.push(Type(() => Date))
	}

	if (isRequired) {
		decorators.push(IsNotEmpty())
		decorators.push(ApiProperty(apiPropertyOptions))
	} else {
		decorators.push(IsOptional())
		decorators.push(ApiPropertyOptional(apiPropertyOptions))
	}

	if (!apiPropertyOptions.type) {
		apiPropertyOptions.type = Function
	}

	return applyDecorators(...decorators)
}
