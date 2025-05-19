# Auth 서비스

이벤트 보상 시스템의 인증 서비스입니다. 사용자 관리, 인증, 권한 관리를 담당합니다.

## 기능

- 사용자 관리 (등록, 조회, 수정)
- 인증 (로그인, 토큰 발급)
- 토큰 관리 (발급, 갱신, 검증)
- 역할 관리 (사용자 역할 설정)

## 기술 스택

- Node.js 18
- NestJS
- MongoDB
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
- `POST /auth/validate` - 토큰 검증

### 사용자 관리 API

- `GET /users` - 모든 사용자 조회
- `GET /users?email={email}` - 이메일로 사용자 조회
- `GET /users/{id}` - ID로 사용자 조회
- `PUT /users/{id}` - 사용자 정보 업데이트
- `DELETE /users/{id}` - 사용자 삭제
- `POST /users/{id}/roles` - 사용자 역할 설정

## 사용자 역할

시스템은 다음과 같은 역할을 지원합니다:

- **USER**: 일반 사용자, 보상 요청 가능
- **OPERATOR**: 운영자, 이벤트 및 보상 관리 가능
- **AUDITOR**: 감사자, 보상 요청 이력 조회만 가능
- **ADMIN**: 관리자, 모든 기능 접근 가능

## API 문서

Swagger UI를 통해 API 문서를 확인할 수 있습니다:

- http://localhost:3001/api-docs
