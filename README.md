# 이벤트 보상 시스템

NestJS, MongoDB 기반의 마이크로서비스 아키텍처로 구현된 이벤트 보상 시스템입니다.

## 시스템 구성

1. **Gateway Server**

   - 모든 API 요청의 진입점
   - 인증/권한 검증
   - 요청 라우팅

2. **Auth Server**

   - 사용자 관리 (등록/로그인)
   - 토큰(JWT) 발급 및 검증
   - 역할(Role) 관리

3. **Event Server**
   - 이벤트 관리 (등록/조회)
   - 보상 관리 (등록/조회)
   - 유저 보상 요청 처리
   - 보상 지급 이력 관리

## 기술 스택

- Node.js 18
- NestJS 11 (최신)
- MongoDB
- JWT 인증
- Docker & docker-compose
- TypeScript
- Swagger (API 문서)

## 시작하기

### 각 서비스별 Docker 실행하기

```bash
# Gateway 서비스만 Docker로 실행
cd gateway
docker-compose up -d

# Auth 서비스만 Docker로 실행
cd auth
docker-compose up -d

# Event 서비스만 Docker로 실행
cd event
docker-compose up -d
```

### 개발 모드로 서비스 실행하기

```bash
# Gateway 서비스
cd gateway
npm run start:dev

# Auth 서비스
cd auth
npm run start:dev

# Event 서비스
cd event
npm run start:dev
```

### [개발용] root에서 전체 실행시

```bash
./dev.sh
```

## API 문서

각 서비스의 API 문서는 Swagger를 통해 확인할 수 있습니다:

- Gateway API: http://localhost:3000/api-docs
- Auth API: http://localhost:3001/api-docs
- Event API: http://localhost:3002/api-docs

API 문서는 서비스가 실행 중일 때만 접근 가능합니다.

## 테스트 데이터 준비하기

개발 및 테스트를 위한 샘플 데이터를 데이터베이스에 추가할 수 있습니다:

```bash
# Auth 서비스에 테스트 사용자 데이터 추가
cd auth
npm run seed

# Event 서비스에 테스트 이벤트 및 보상 데이터 추가
cd event
npm run seed
```

샘플 데이터는 각 서비스의 `src/seed-data.ts` 파일에 정의되어 있습니다.

## API 목록

### 인증 API (Auth)

| 메소드 | 엔드포인트           | 설명                 | 권한            |
| ------ | -------------------- | -------------------- | --------------- |
| POST   | /auth/register       | 사용자 등록          | 없음            |
| POST   | /auth/login          | 로그인               | 없음            |
| POST   | /auth/refresh        | 토큰 갱신            | 없음            |
| GET    | /users?email={email} | 이메일로 사용자 조회 | ADMIN, OPERATOR |
| GET    | /users/{id}          | ID로 사용자 조회     | ADMIN, OPERATOR |

### 이벤트 API (Event)

| 메소드 | 엔드포인트           | 설명                   | 권한            |
| ------ | -------------------- | ---------------------- | --------------- |
| GET    | /events              | 모든 이벤트 조회       | ADMIN, OPERATOR |
| GET    | /events?active=true  | 활성화된 이벤트 조회   | ADMIN, OPERATOR |
| GET    | /events?active=false | 비활성화된 이벤트 조회 | ADMIN, OPERATOR |
| GET    | /events/{id}         | 특정 이벤트 조회       | ADMIN, OPERATOR |
| POST   | /events              | 이벤트 생성            | ADMIN, OPERATOR |
| PUT    | /events/{id}         | 이벤트 수정            | ADMIN, OPERATOR |
| DELETE | /events/{id}         | 이벤트 삭제            | ADMIN           |

### 보상 API (Reward)

| 메소드 | 엔드포인트                 | 설명                    | 권한            |
| ------ | -------------------------- | ----------------------- | --------------- |
| GET    | /rewards                   | 모든 보상 조회          | 없음            |
| GET    | /rewards?eventId={eventId} | 특정 이벤트의 보상 조회 | 없음            |
| GET    | /rewards/{id}              | 특정 보상 조회          | 없음            |
| POST   | /rewards                   | 보상 생성               | ADMIN, OPERATOR |
| PUT    | /rewards/{id}              | 보상 수정               | ADMIN, OPERATOR |
| DELETE | /rewards/{id}              | 보상 삭제               | ADMIN           |

### 보상 요청 API (Reward Request)

| 메소드 | 엔드포인트                                                         | 설명                                  | 권한                     |
| ------ | ------------------------------------------------------------------ | ------------------------------------- | ------------------------ |
| POST   | /reward-requests                                                   | 보상 요청                             | USER, ADMIN              |
| GET    | /reward-requests                                                   | 모든 보상 요청 조회                   | AUDITOR, OPERATOR, ADMIN |
| GET    | /reward-requests?status={status}                                   | 상태별 보상 요청 조회                 | AUDITOR, OPERATOR, ADMIN |
| GET    | /reward-requests?eventId={eventId}                                 | 이벤트별 보상 요청 조회               | AUDITOR, OPERATOR, ADMIN |
| GET    | /reward-requests?userId={userId}                                   | 사용자별 보상 요청 조회               | AUDITOR, OPERATOR, ADMIN |
| GET    | /reward-requests?status={status}&eventId={eventId}&userId={userId} | 여러 조건으로 필터링된 보상 요청 조회 | AUDITOR, OPERATOR, ADMIN |
