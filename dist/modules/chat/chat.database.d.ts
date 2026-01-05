import type { ChatMessageDoc, ChatMessageEntity } from "./chat.model.js";
export declare class ChatDatabase {
    private col;
    insert(doc: ChatMessageDoc): Promise<ChatMessageEntity>;
    list(params: {
        limit: number;
        before?: Date | undefined;
    }): Promise<ChatMessageEntity[]>;
}
//# sourceMappingURL=chat.database.d.ts.map