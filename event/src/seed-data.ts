import { MongoClient, ObjectId } from "mongodb";

// MongoDB 연결 정보
const MONGODB_URI = process.env.MONGO_URI;

// 샘플 이벤트 데이터
const eventsSampleData = [
  {
    _id: new ObjectId(),
    title: "여름 특별 퀘스트",
    description: "여름 테마 퀘스트를 모두 완료하면 한정판 아이템을 받을 수 있습니다.",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-08-31"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: "신규 유저 웰컴 이벤트",
    description: "신규 가입 유저에게 특별 보상을 제공합니다.",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: "첫 구매 이벤트",
    description: "첫 결제 시 추가 보너스를 지급합니다.",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-12-31"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 샘플 보상 데이터
const rewardsSampleData = [
  {
    _id: new ObjectId(),
    name: "여름 테마 펫",
    description: "여름 스페셜 퀘스트 완료 보상으로 지급되는 한정판 펫입니다.",
    quantity: 30,
    claimed: 5,
    event: eventsSampleData[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: "초보자 패키지",
    description: "게임 시작을 돕기 위한, 다양한 아이템이 포함된 패키지입니다.",
    quantity: 500,
    claimed: 320,
    event: eventsSampleData[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: "구매 보너스 코인",
    description: "첫 구매 시 지급되는 특별 보너스 코인입니다.",
    quantity: 1000,
    claimed: 235,
    event: eventsSampleData[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 샘플 보상 요청 데이터
const rewardRequestsSampleData = [
  {
    _id: new ObjectId(),
    userId: "60d21b4667d0d8992e610c85", // 가상의 유저 ID
    reward: rewardsSampleData[1]._id,
    status: "approved",
    approvedAt: new Date("2025-05-15"),
    createdAt: new Date("2025-05-14"),
    updatedAt: new Date("2025-05-15"),
  },
  {
    _id: new ObjectId(),
    userId: "60d21b4667d0d8992e610c86", // 가상의 유저 ID
    reward: rewardsSampleData[1]._id,
    status: "rejected",
    createdAt: new Date("2025-05-20"),
    updatedAt: new Date("2025-05-20"),
  },

  {
    _id: new ObjectId(),
    userId: "60d21b4667d0d8992e610c88", // 가상의 유저 ID
    reward: rewardsSampleData[0]._id,
    status: "approved",
    approvedAt: new Date("2025-07-25"),
    createdAt: new Date("2025-07-24"),
    updatedAt: new Date("2025-07-25"),
  },
  {
    _id: new ObjectId(),
    userId: "60d21b4667d0d8992e610c89", // 가상의 유저 ID
    reward: rewardsSampleData[2]._id,
    status: "approved",
    approvedAt: new Date("2025-04-05"),
    createdAt: new Date("2025-04-04"),
    updatedAt: new Date("2025-04-05"),
  },
];

// 샘플 데이터를 DB에 삽입하는 함수
async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("MongoDB에 연결되었습니다.");

    const db = client.db();

    // 기존 데이터 삭제
    await db.collection("events").deleteMany({});
    await db.collection("rewards").deleteMany({});
    await db.collection("rewardrequests").deleteMany({});

    console.log("기존 데이터가 삭제되었습니다.");

    // 새 데이터 삽입
    await db.collection("events").insertMany(eventsSampleData);
    await db.collection("rewards").insertMany(rewardsSampleData);
    await db.collection("rewardrequests").insertMany(rewardRequestsSampleData);

    console.log("샘플 데이터가 성공적으로 삽입되었습니다.");
  } catch (error) {
    console.error("데이터 시드 중 오류 발생:", error);
  } finally {
    await client.close();
    console.log("MongoDB 연결이 종료되었습니다.");
  }
}

// 스크립트 실행
seedDatabase();
