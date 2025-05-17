#!/bin/bash

# 환경 변수 로드
export $(grep -v '^#' .env | xargs)

# 루트 디렉토리에 concurrently 패키지 설치 확인
if [ ! -d "node_modules/concurrently" ]; then
  echo "concurrently 패키지를 로컬에 설치합니다..."
  npm install
fi

# 모든 서비스 실행
echo "모든 마이크로서비스를 실행합니다..."
npx concurrently "npm run start:auth" "npm run start:event" "npm run start:gateway" 