import type http from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { verifyAccessToken } from "../utils/jwt.js";
import { UserDatabase } from "../modules/user/user.database.js";
import { ChatDatabase } from "../modules/chat/chat.database.js";
import { ChatService } from "../modules/chat/chat.service.js";

type WsClient = WebSocket & {
  user?: {
    userId: string;
    email: string;
    role: "customer" | "admin";
  };
};

type ClientInbound = { type: "ping" } | { type: "message"; text: string };

function safeJsonParse(data: unknown): any | null {
  try {
    const s =
      typeof data === "string"
        ? data
        : Buffer.isBuffer(data)
        ? data.toString("utf8")
        : null;
    if (!s) return null;
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export function attachWsServer(server: http.Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  const userDb = new UserDatabase();
  const chatDb = new ChatDatabase();
  const chatService = new ChatService(chatDb);

  function broadcast(obj: unknown) {
    const payload = JSON.stringify(obj);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  wss.on("connection", async (ws: WsClient, req) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(1008, "Missing token");
      return;
    }

    let payload: { sub: string; role: "customer" | "admin" };
    try {
      payload = verifyAccessToken(token);
    } catch {
      ws.close(1008, "Invalid token");
      return;
    }

    const user = await userDb.findById(payload.sub);
    if (!user) {
      ws.close(1008, "User not found");
      return;
    }

    ws.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    ws.send(
      JSON.stringify({
        type: "hello",
        data: { userEmail: ws.user.email, role: ws.user.role },
      })
    );

    broadcast({
      type: "presence",
      data: { event: "join", userEmail: ws.user.email },
    });

    ws.on("message", async (raw) => {
      const msg = safeJsonParse(raw) as ClientInbound | null;
      if (!msg) {
        ws.send(
          JSON.stringify({ type: "error", error: { message: "Invalid JSON" } })
        );
        return;
      }

      if (msg.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
        return;
      }

      if (msg.type === "message") {
        if (!ws.user) {
          ws.send(
            JSON.stringify({
              type: "error",
              error: { message: "Unauthorized" },
            })
          );
          return;
        }

        const saved = await chatService.postMessage({
          userId: ws.user.userId,
          userEmail: ws.user.email,
          role: ws.user.role,
          text: msg.text,
        });

        broadcast({
          type: "message",
          data: {
            id: saved._id.toString(),
            userEmail: saved.userEmail,
            role: saved.role,
            text: saved.text,
            createdAt: saved.createdAt,
          },
        });

        return;
      }

      ws.send(
        JSON.stringify({
          type: "error",
          error: { message: "Unknown message type" },
        })
      );
    });

    ws.on("close", () => {
      if (ws.user) {
        broadcast({
          type: "presence",
          data: { event: "leave", userEmail: ws.user.email },
        });
      }
    });
  });

  return wss;
}
