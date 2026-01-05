import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { ensureIndexes } from "./database/indexes.js";
import { connectMongo } from "./database/mongo.js";
async function bootstrap() {
    await connectMongo();
    await ensureIndexes();
    const app = createApp();
    app.listen(env.port, () => {
        `[SERVER] Listening on port ${env.port} (${env.nodeEnv})`;
    });
}
bootstrap().catch((error) => {
    console.error("[BOOTSTRAP] Failed", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map