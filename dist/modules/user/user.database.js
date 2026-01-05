import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class UserDatabase {
    col() {
        return getDb().collection("users");
    }
    async list() {
        return this.col().find({}).limit(50).toArray();
    }
    async findByEmail(email) {
        return this.col().findOne({ email });
    }
    async findById(id) {
        return this.col().findOne({
            _id: new ObjectId(id),
        });
    }
    async create(doc) {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }
    // Thêm InsertMany
    async createMany(docs) {
        const res = await this.col().insertMany(docs);
        return docs.map((doc, index) => {
            const id = res.insertedIds[index];
            if (!id) {
                throw new Error(`insertMany: missing insertedId at index ${index}`);
            }
            return { ...doc, _id: id };
        });
    }
    async updateById(id, set) {
        return this.col().findOneAndUpdate({ _id: new ObjectId(id) }, { $set: set }, { returnDocument: "after" });
    }
    async deleteById(id) {
        const res = await this.col().deleteOne({ _id: new ObjectId(id) });
        return res.deletedCount === 1;
    }
}
//# sourceMappingURL=user.database.js.map