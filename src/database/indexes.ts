import { getDb } from "./mongo.js";

export async function ensureIndexes(): Promise<void> {
  const db = getDb();

  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  await db
    .collection("products")
    .createIndex(
      { title: "text", description: "text" },
      { name: "product_text_search" }
    );

  await db
    .collection("products")
    .createIndex({ category: 1, status: 1, price: 1 });
    
  await db.collection("products").createIndex({ createdAt: -1 });

  await db
    .collection("refresh_token")
    .createIndex(
      { userId: 1, revokedAt: 1, expiresAt: 1 },
      { name: "rt_user_active" }
    );

  await db
    .collection("chat_messages")
    .createIndex({ createdAt: -1 }, { name: "chat_timeline" });
}
