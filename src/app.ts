import cookieParser from "cookie-parser";
import express from "express";
import { userRouters } from "./modules/user/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { productRoutes } from "./modules/product/product.routes.js";
import { chatRoutes } from "./modules/chat/chat.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());

  // check server run or not
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // User module
  app.use("/api/users", userRouters);

  // Auth module
  app.use("/api/auth", authRoutes);

  // Product module
  app.use("/api/products", productRoutes);

  // Chat module
  app.use("/api/chat", chatRoutes);

  app.use(errorMiddleware);

  return app;
}
