import { MongoClient, Db } from "mongodb";
import { env } from "../config/env.js";
let client = null;
let db = null;
export async function connectMongo() {
    if (db)
        return db;
    client = new MongoClient(env.mongoUri);
    await client.connect();
    db = client.db(env.mongoDb);
    return db;
}
export function getDb() {
    if (!db)
        throw new Error("MongoDb is not connected.");
    return db;
}
export async function disconnectMongo() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}
//# sourceMappingURL=mongo.js.map