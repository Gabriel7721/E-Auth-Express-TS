import type { ChatDatabase } from "./chat.database.js";
export declare class ChatService {
    private readonly chatDb;
    constructor(chatDb: ChatDatabase);
    postMessage(input: {
        userId: string;
        userEmail: string;
        role: "customer" | "admin";
        text: string;
    }): Promise<import("./chat.model.js").ChatMessageEntity>;
    listHistory(input: {
        limit?: string;
        before?: string;
    }): Promise<import("./chat.model.js").ChatMessageEntity[]>;
}
//# sourceMappingURL=chat.service.d.ts.map