# Event 서비스

이벤트 보상 시스템의 이벤트 서비스입니다. 이벤트 관리와 보상 처리를 담당합니다.

## 기능

- 이벤트 관리 (생성, 조회, 수정, 삭제)
- 보상 관리 (생성, 조회, 수정, 삭제)
- 보상 요청 처리 (요청)
- 보상 요청 이력 관리

## 기술 스택

- Node.js 18
- NestJS
- MongoDB
- TypeScript

## 시작하기

```bash
# 개발 모드로 실행
npm run start:dev

# 프로덕션 모드로 빌드
npm run build

# 프로덕션 모드로 실행
npm run start:prod
```

## API 엔드포인트

### 이벤트 관련

- `GET /events` - 모든 이벤트 조회
- `GET /events/active` - 현재 활성화된 이벤트만 조회
- `GET /events/public` - 공개 이벤트 조회
- `GET /events/:id` - 특정 이벤트 조회
- `POST /events` - 새 이벤트 생성 [관리자만]
- `PUT /events/:id` - 이벤트 정보 업데이트 [관리자만]
- `DELETE /events/:id` - 이벤트 삭제 [관리자만]

### 보상 관련

- `GET /rewards` - 모든 보상 조회
- `GET /rewards/:id` - 특정 보상 조회
- `GET /rewards/event/:eventId` - 특정 이벤트의 보상 조회
- `POST /rewards` - 새 보상 생성 [관리자만]
- `PUT /rewards/:id` - 보상 정보 업데이트 [관리자만]
- `DELETE /rewards/:id` - 보상 삭제 [관리자만]

### 보상 요청 관련

- `POST /rewards/request` - 보상 요청 [로그인 필요]
- `GET /rewards/requests/user/:userId` - 특정 사용자의 보상 요청 조회 [로그인 필요]
- `GET /rewards/requests/event/:eventId` - 특정 이벤트의 보상 요청 조회 [관리자/감사자만]
- `GET /rewards/requests` - 상태별 보상 요청 조회 [관리자/감사자만]
