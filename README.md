# nestjs-prisma-template

## 개요

GraphQL 서버 예제 리포지터리 입니다.

웹 프레임워크 : `NestJS`

ORM : `Prisma`

구현체 : `Apollo`

## 셋업

1. 환경변수

- `.env.example`을 복사하여 `.env.local` 파일을 생성
- 현재는 `DATABASE_URL`만 셋업해도 작동합니다.

```console
...
DATABASE_URL="mysql://default:secret@localhost:3307/template"
...
```

2. 데이터베이스

```console
# dependancy 설치
yarn

# 스키마 업데이트
yarn prisma:local migrate db push

# 테스트 데이터 import
yarn prisma:local migrate db seed
```

3. 실행

- `yarn dev:server`로 실행 후 `localhost:5000/graphql`으로 접속

---

## How it works?

1. prisma 스키마 정의(schema.prisma)
2. prisma-class-generator를 통한 class, decorator 생성
3. @nestjs/graphql(typegraphql)에서 decorator 파싱 및 .gql 정의 -> code-first approach
4. gql 기반 Apollo Graphql 구동

리소스 및 input, output이 모두 class로 정의되고 이것을 기반으로 graphql의 모든 맥락이 정의됩니다.

또한 Apollo 구현체에서는 이를 기반으로 플레이그라운드 페이지 및 doc 생성을 지원하고 있기 때문에 swagger를 대체할 수 있습니다.

## 컨벤션

추가로 구현된 복잡한 비즈니스 로직이 아닌 기본 리소스 기반의 CRUD는 다음과 같은 규칙을 따를 예정입니다.

### Query

- 단수형 리소스 word : 단일 리소스 조회

```graphql
query {
  glass {
    id
    name
  }
}
```

- 복수형 리소스 word : 리스트 리소스 + 카운트 조회

```graphql
query {
  glasses {
    totalCount
    items {
      id
      name
    }
  }
}
```

### Mutation

- 생성

```graphql
mutation {
  createGlass(
    input: { name: "소주잔", name_english: "soju_glass", volume: "1~2" }
  ) {
    id
    name
  }
}
```

- 수정

```graphql
mutation {
  updateGlass(input: { id: 1, name: "소맥잔" }) {
    id
    name
  }
}
```

### Subscription

현재는 미사용
