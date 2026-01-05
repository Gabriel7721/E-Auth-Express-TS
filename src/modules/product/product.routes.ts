import { Router } from "express";
import { ProductDatabase } from "./product.database.js";
import { ProductService } from "./product.service.js";
import { ProductController } from "./product.controller.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

const db = new ProductDatabase();
const service = new ProductService(db);
const controller = new ProductController(service);

// Public
router.get("/", controller.list);
router.get("/:id", controller.getById);

// Admin
router.post("/", requireAuth, requireRole("admin"), controller.create);
router.patch("/:id", requireAuth, requireRole("admin"), controller.patch);
router.delete("/:id", requireAuth, requireRole("admin"), controller.delete);

export const productRoutes = router;
