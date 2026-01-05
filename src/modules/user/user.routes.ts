import { Router } from "express";
import { UserDatabase } from "./user.database.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

const db = new UserDatabase();
const service = new UserService(db);
const controller = new UserController(service);

router.get("/", controller.list);
router.post("/register", controller.register);

router.get("/:id", requireAuth, controller.getById);
router.get("/by-email/:email", controller.getByEmail);

router.put("/:id", requireAuth, controller.updatePut);
router.patch("/:id", requireAuth, controller.updatePatch);

router.delete("/:id", requireAuth, controller.delete);

export const userRouters = router;
