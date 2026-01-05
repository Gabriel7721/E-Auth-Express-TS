import { getDb } from "../../database/mongo.js";
export class ChatDatabase {
    col() {
        return getDb().collection("chat_messages");
    }
    async insert(doc) {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }
    async list(params) {
        const filter = {};
        if (params.before)
            filter.createdAt = { $lt: params.before };
        return this.col()
            .find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .limit(params.limit)
            .toArray();
    }
}
//# sourceMappingURL=chat.database.js.map