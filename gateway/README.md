# Gateway 서비스

이벤트 보상 시스템의 API Gateway 서비스입니다. 인증 처리와 요청 라우팅을 담당합니다.

## 기능

- API 요청 라우팅 (Auth 서비스, Event 서비스로 전달)
- 인증 및 권한 검증
- API 문서화 (Swagger)

## 기술 스택

- Node.js 18
- NestJS
- JWT 인증
- TypeScript

## 시작하기

```bash
# 개발 모드로 실행
npm run start:dev

# Docker로 실행
docker-compose up -d

# 프로덕션 모드로 빌드
npm run build

# 프로덕션 모드로 실행
npm run start:prod
```

## API 엔드포인트

### 인증 API

- `POST /auth/register` - 사용자 등록
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `GET /users?email={email}` - 이메일로 사용자 조회 (ADMIN, OPERATOR)
- `GET /users/{id}` - ID로 사용자 조회 (ADMIN, OPERATOR)
- `POST /users/{id}/roles` - 사용자 역할 설정 (ADMIN)

### 이벤트 API

- `GET /events` - 모든 이벤트 조회 (ADMIN, OPERATOR)
- `GET /events?active=true` - 활성화된 이벤트만 조회 (ADMIN, OPERATOR)
- `GET /events?active=false` - 비활성화된 이벤트만 조회 (ADMIN, OPERATOR)
- `GET /events/{id}` - 특정 이벤트 조회 (ADMIN, OPERATOR)
- `POST /events` - 새 이벤트 생성 (ADMIN, OPERATOR)
- `PUT /events/{id}` - 이벤트 정보 업데이트 (ADMIN, OPERATOR)
- `DELETE /events/{id}` - 이벤트 삭제 (ADMIN)

### 보상 API

- `GET /rewards` - 모든 보상 조회 (ADMIN, OPERATOR)
- `GET /rewards?eventId={eventId}` - 특정 이벤트의 보상 조회 (ADMIN, OPERATOR)
- `GET /rewards/{id}` - 특정 보상 조회 (ADMIN, OPERATOR)
- `POST /rewards` - 새 보상 생성 (ADMIN, OPERATOR)
- `PUT /rewards/{id}` - 보상 정보 업데이트 (ADMIN, OPERATOR)
- `DELETE /rewards/{id}` - 보상 삭제 (ADMIN)

### 보상 요청 API

- `POST /reward-requests` - 보상 요청 (USER, ADMIN)
- `GET /reward-requests` - 모든 보상 요청 조회 (AUDITOR, OPERATOR, ADMIN)
- `GET /reward-requests?status={status}` - 상태별 보상 요청 조회 (AUDITOR, OPERATOR, ADMIN)
- `GET /reward-requests?eventId={eventId}` - 특정 이벤트의 보상 요청 조회 (AUDITOR, OPERATOR, ADMIN)
- `GET /reward-requests?userId={userId}` - 특정 사용자의 보상 요청 조회 (AUDITOR, OPERATOR, ADMIN)
- `GET /reward-requests?status={status}&eventId={eventId}&userId={userId}` - 여러 조건으로 필터링된 보상 요청 조회 (AUDITOR, OPERATOR, ADMIN)

## API 문서

Swagger UI를 통해 API 문서를 확인할 수 있습니다:

- http://localhost:3000/api-docs
