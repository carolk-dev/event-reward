FROM node:18-alpine
WORKDIR /app

# bcrypt가 필요한 빌드 종속성 설치
RUN apk add --no-cache python3 make g++

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 소스 코드 복사
COPY . .

# 개발 의존성을 설치하고 빌드 후 개발 의존성 제거
RUN npm ci && npm run build && npm prune --production

# 빌드 의존성 제거
RUN apk del python3 make g++

EXPOSE 3001

CMD ["node", "dist/main.js"]
