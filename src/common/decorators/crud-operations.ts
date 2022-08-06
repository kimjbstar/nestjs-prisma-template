import { ResponseInterceptor } from "@src/interceptors/response.interceptor";
import {
  applyDecorators,
  Delete,
  Get,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { camelCase } from "change-case";
import { ClassConstructorType } from "../dto/responses";
import { ApiNormalResponse } from "./api-normal-response";
import { ApiPaginatedResponse } from "./api-paginated-response";

export const ApiReadListOperation = (model: ClassConstructorType) => {
  return applyDecorators(
    Get(),
    ApiOperation({
      summary: `[CRUD] ${model.name} 페이지네이트 리스트 결과 리턴`,
      description: `${model.name} 페이지네이트 리스트 결과 리턴`,
    }),
    ApiPaginatedResponse(model)
  );
};

export const ApiCreateOperation = (model: ClassConstructorType) => {
  return applyDecorators(
    Post(),
    ApiNormalResponse({
      models: {
        [camelCase(model.name)]: model,
      },
      description: `[CRUD] ${model.name} 생성`,
    }),
    UseInterceptors(ResponseInterceptor)
  );
};

export const ApiReadSingleOperation = (model: ClassConstructorType) => {
  return applyDecorators(
    Get(":id"),
    ApiParam({ type: Number, name: "id", description: "조회할 ID" }),
    ApiNormalResponse({
      models: {
        [camelCase(model.name)]: model,
      },
      description: `[CRUD] ${model.name} 단일 결과 리턴`,
    }),
    UseInterceptors(ResponseInterceptor)
  );
};

export const ApiUpdateOperation = (model: ClassConstructorType) => {
  return applyDecorators(
    Put(":id"),
    ApiParam({ type: Number, name: "id", description: "수정할 ID" }),
    ApiNormalResponse({
      models: {
        [camelCase(model.name)]: model,
      },
      description: `[CRUD] ${model.name} 수정`,
    }),
    UseInterceptors(ResponseInterceptor)
  );
};

export const ApiDeleteOperation = (model: ClassConstructorType) => {
  return applyDecorators(
    Delete(":id"),
    ApiParam({ type: Number, name: "id", description: "삭제할 ID" }),
    ApiNormalResponse({
      models: {
        [camelCase(model.name)]: model,
      },
      description: `[CRUD] ${model.name} 삭제`,
    }),
    UseInterceptors(ResponseInterceptor)
  );
};
