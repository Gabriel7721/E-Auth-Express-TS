import { ok } from "../../utils/http.js";
export class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    listMessage = async (req, res) => {
        const messages = await this.chatService.listHistory(req.query);
        res.json(ok(messages.map((m) => ({
            id: m._id.toString(),
            userEmail: m.userEmail,
            role: m.role,
            text: m.text,
            createdAt: m.createdAt,
        }))));
    };
}
//# sourceMappingURL=chat.controller.js.map