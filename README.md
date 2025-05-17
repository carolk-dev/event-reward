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

```bash
# 시스템 실행
docker-compose up -d

# 개발 모드로 각 서비스 실행
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

## API 문서

각 서비스의 API 문서는 Swagger를 통해 확인할 수 있습니다:

- Gateway API: http://localhost:3000/api-docs
- Auth API: http://localhost:3001/api-docs
- Event API: http://localhost:3002/api-docs

API 문서는 서비스가 실행 중일 때만 접근 가능합니다.
