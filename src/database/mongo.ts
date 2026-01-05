import { MongoClient, Db } from "mongodb";
import { env } from "../config/env.js";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(env.mongoUri);
  await client.connect();
  db = client.db(env.mongoDb);
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error("MongoDb is not connected.");
  
  return db;
}

export async function disconnectMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
