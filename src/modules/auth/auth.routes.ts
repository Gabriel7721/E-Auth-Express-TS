import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthDatabase } from "./auth.database.js";
import { UserDatabase } from "../user/user.database.js";

const router = Router();

const userDb = new UserDatabase();
const authDb = new AuthDatabase();
const service = new AuthService(userDb, authDb);
const controller = new AuthController(service);

router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

export const authRoutes = router;
