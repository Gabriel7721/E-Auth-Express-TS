import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class AuthDatabase {
    col() {
        return getDb().collection("refresh_tokens");
    }
    async insert(doc) {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }
    async findActiveByTokenId(tokenId) {
        return this.col().findOne({
            tokenId,
            revokedAt: { $exists: false },
            expiresAt: { $gt: new Date() },
        });
    }
    async revoke(tokenId, replacedByTokenId) {
        await this.col().updateOne({ tokenId }, {
            $set: {
                revokedAt: new Date(),
                ...(replacedByTokenId ? { replacedByTokenId } : {}),
            },
        });
    }
}
//# sourceMappingURL=auth.database.js.map