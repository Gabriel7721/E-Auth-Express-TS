import type { Filter } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { ChatMessageDoc, ChatMessageEntity } from "./chat.model.js";

export class ChatDatabase {
  private col() {
    return getDb().collection<ChatMessageDoc>("chat_messages");
  }

  async insert(doc: ChatMessageDoc): Promise<ChatMessageEntity> {
    const res = await this.col().insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }

  async list(params: {
    limit: number;
    before?: Date | undefined;
  }): Promise<ChatMessageEntity[]> {
    const filter: Filter<ChatMessageDoc> = {};

    if (params.before) filter.createdAt = { $lt: params.before };

    return this.col()
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(params.limit)
      .toArray() as Promise<ChatMessageEntity[]>;
  }
}
