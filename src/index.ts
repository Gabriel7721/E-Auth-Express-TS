import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { ensureIndexes } from "./database/indexes.js";
import { connectMongo } from "./database/mongo.js";
import http from "node:http";
import { attachWsServer } from "./realtime/ws.js";

async function bootstrap() {
  await connectMongo();
  await ensureIndexes();

  const app = createApp();

  const server = http.createServer(app);
  attachWsServer(server);
  server.listen(env.port, () => {
    console.log(`[Server WS] is running on: ws://localhost:${env.port}`);
  });

  app.listen(env.port, () => {
    `[SERVER] Listening on port ${env.port} (${env.nodeEnv})`;
  });
}

bootstrap().catch((error) => {
  console.error("[BOOTSTRAP] Failed", error);
  process.exit(1);
});
