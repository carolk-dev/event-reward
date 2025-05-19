/**
 * 사용자 역할 정의
 * USER: 보상 요청 가능
 * OPERATOR: 이벤트/보상 등록
 * AUDITOR: 보상 이력조회만 가능
 * ADMIN: 모든 기능 접근가능
 */
export enum UserRole {
  USER = "user",
  OPERATOR = "operator",
  ADMIN = "admin",
  AUDITOR = "auditor",
}
