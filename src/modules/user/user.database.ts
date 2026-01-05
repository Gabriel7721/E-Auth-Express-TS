import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { UserDoc } from "./user.model.js";

export type UserEntity = UserDoc & { _id: ObjectId };

export class UserDatabase {
  private col() {
    return getDb().collection<UserDoc>("users");
  }

  async list(): Promise<UserEntity[]> {
    return this.col().find({}).limit(50).toArray() as Promise<UserEntity[]>;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.col().findOne({ email }) as Promise<UserEntity | null>;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.col().findOne({
      _id: new ObjectId(id),
    }) as Promise<UserEntity | null>;
  }

  async create(doc: UserDoc): Promise<UserEntity> {
    const res = await this.col().insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }

  // Thêm InsertMany
  async createMany(docs: UserDoc[]): Promise<UserEntity[]> {
    const res = await this.col().insertMany(docs);
    return docs.map((doc, index) => {
      const id = res.insertedIds[index];
      if (!id) {
        throw new Error(`insertMany: missing insertedId at index ${index}`);
      }
      return { ...doc, _id: id };
    });
  }

  async updateById(
    id: string,
    set: Partial<UserDoc>
  ): Promise<UserEntity | null> {
    return this.col().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    ) as Promise<UserEntity | null>;
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this.col().deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount === 1;
  }
}
