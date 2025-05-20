import { MongoClient, ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();
// MongoDB 연결 정보
const MONGODB_URI = process.env.MONGO_URI;

// 비밀번호 해싱 함수
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

// 샘플 사용자 데이터 생성
async function createUsersSampleData() {
  // 미리 해싱된 비밀번호 (모두 'password123')
  const hashedPassword = await hashPassword("password123");

  return [
    {
      _id: new ObjectId(),
      username: "admin_user",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId(),
      username: "operator_user",
      email: "operator@example.com",
      password: hashedPassword,
      role: "operator",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId(),
      username: "auditor_user",
      email: "auditor@example.com",
      password: hashedPassword,
      role: "auditor",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId("60d21b4667d0d8992e610c85"), // Event 서비스의 보상 요청에 사용된 ID와 일치시킴
      username: "normal_user1",
      email: "user1@example.com",
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId("60d21b4667d0d8992e610c86"), // Event 서비스의 보상 요청에 사용된 ID와 일치시킴
      username: "normal_user2",
      email: "user2@example.com",
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId("60d21b4667d0d8992e610c88"), // Event 서비스의 보상 요청에 사용된 ID와 일치시킴
      username: "normal_user3",
      email: "user3@example.com",
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId("60d21b4667d0d8992e610c89"), // Event 서비스의 보상 요청에 사용된 ID와 일치시킴
      username: "normal_user4",
      email: "user4@example.com",
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

// 샘플 데이터를 DB에 삽입하는 함수
async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("MongoDB에 연결되었습니다.");

    const db = client.db();
    /*
    // 기존 데이터 삭제
    await db.collection("users").deleteMany({});
    console.log("기존 사용자 데이터가 삭제되었습니다.");
*/
    // 새 데이터 삽입
    const usersSampleData = await createUsersSampleData();
    await db.collection("users").insertMany(usersSampleData);

    console.log("사용자 샘플 데이터가 성공적으로 삽입되었습니다.");

    // 삽입된 사용자 출력
    console.log("\n사용자 계정 정보:");
    console.log("--------------------------");
    usersSampleData.forEach((user) => {
      console.log(`사용자명: ${user.username}`);
      console.log(`이메일: ${user.email}`);
      console.log(`역할: ${user.role}`);
      console.log(`비밀번호: password123 (해싱됨)`);
      console.log("--------------------------");
    });
  } catch (error) {
    console.error("데이터 시드 중 오류 발생:", error);
  } finally {
    await client.close();
    console.log("MongoDB 연결이 종료되었습니다.");
  }
}

// 스크립트 실행
seedDatabase();
