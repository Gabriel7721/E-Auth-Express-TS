import { ObjectId } from "mongodb";
import { ApiError } from "../../utils/http.js";
import type { ChatDatabase } from "./chat.database.js";

export class ChatService {
  constructor(private readonly chatDb: ChatDatabase) {}

  async postMessage(input: {
    userId: string;
    userEmail: string;
    role: "customer" | "admin";
    text: string;
  }) {
    const text = (input.text || "").trim();

    if (!text) throw new ApiError(400, { message: "Text message is required" });
    if (text.length > 1000)
      throw new ApiError(400, { message: "Text message is too long" });

    const now = new Date();

    return this.chatDb.insert({
      userId: new ObjectId(input.userId),
      userEmail: input.userEmail,
      role: input.role,
      text,
      createdAt: now,
    });
  }

  async listHistory(input: { limit?: string; before?: string }) {
    const limit = parsePositive(input.limit, 5, 10);

    let beforeDate: Date | undefined;

    if (input.before) {
      const d = new Date(input.before);
      if (Number.isNaN(d.getTime()))
        throw new ApiError(400, { message: "Invalid before 1970" });
      beforeDate = d;
    }
    return this.chatDb.list({ limit, before: beforeDate });
  }
}
function parsePositive(v: string | undefined, fallback: number, max: number) {
  if (!v) return fallback;

  const n = Number(v);

  if (!Number.isInteger(n) || n <= 0) return fallback;

  return Math.min(n, max);
}
