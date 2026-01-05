import type { ObjectId } from "mongodb";
export type ChatMessageDoc = {
    userId: ObjectId;
    userEmail: string;
    role: "customer" | "admin";
    text: string;
    createdAt: Date;
};
export type ChatMessageEntity = ChatMessageDoc & {
    _id: ObjectId;
};
//# sourceMappingURL=chat.model.d.ts.map