import { Router } from "express";
import { ChatDatabase } from "./chat.database.js";
import { ChatService } from "./chat.service.js";
import { ChatController } from "./chat.controller.js";

const router = Router();

const db = new ChatDatabase();
const service = new ChatService(db);
const controller = new ChatController(service);

router.get("/messages", controller.listMessage);

export const chatRoutes = router;
