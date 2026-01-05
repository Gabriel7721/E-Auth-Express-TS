import { ObjectId } from "mongodb";
import { ApiError } from "../../utils/http.js";
import { verifyPassword } from "../../utils/crypto.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, } from "../../utils/jwt.js";
import { env } from "../../config/env.js";
function randomTokenId() {
    return crypto.randomUUID();
}
export class AuthService {
    userDb;
    authDb;
    constructor(userDb, authDb) {
        this.userDb = userDb;
        this.authDb = authDb;
    }
    async login(input) {
        const email = input.email.trim().toLowerCase();
        const user = await this.userDb.findByEmail(email);
        if (!user)
            throw new ApiError(401, { message: "Invalid credentials" });
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok)
            throw new ApiError(401, { message: "Invalid credentials" });
        const accessToken = signAccessToken({
            sub: user._id.toString(),
            role: user.role,
        });
        const tokenId = randomTokenId();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + env.refreshTokenTtlSeconds * 1000);
        const doc = {
            userId: user._id,
            tokenId,
            issuedAt: now,
            expiresAt,
            ...(input.userAgent !== undefined ? { userAgent: input.userAgent } : {}),
            ...(input.ip !== undefined ? { ip: input.ip } : {}),
        };
        await this.authDb.insert(doc);
        const refreshToken = signRefreshToken({
            sub: user._id.toString(),
            jti: tokenId,
        });
        return { accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        }
        catch {
            throw new ApiError(401, { message: "Invalid or expired refresh token" });
        }
        const active = await this.authDb.findActiveByTokenId(payload.jti);
        if (!active)
            throw new ApiError(401, {
                message: "Refresh token revoked or not found",
            });
        const user = await this.userDb.findById(payload.sub);
        if (!user)
            throw new ApiError(401, { message: "User no longer exists" });
        const newTokenId = randomTokenId();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + env.refreshTokenTtlSeconds * 1000);
        const doc = {
            userId: new ObjectId(payload.sub),
            tokenId: newTokenId,
            issuedAt: now,
            expiresAt,
            ...(active.userAgent !== undefined
                ? { userAgent: active.userAgent }
                : {}),
            ...(active.ip !== undefined ? { ip: active.ip } : {}),
        };
        await this.authDb.insert(doc);
        await this.authDb.revoke(payload.jti, newTokenId);
        const accessToken = signAccessToken({
            sub: user._id.toString(),
            role: user.role,
        });
        const newRefreshToken = signRefreshToken({
            sub: user._id.toString(),
            jti: newTokenId,
        });
        return { accessToken, refreshToken: newRefreshToken };
    }
    async logout(refreshToken) {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        }
        catch {
            return;
        }
        await this.authDb.revoke(payload.jti);
    }
}
//# sourceMappingURL=auth.service.js.map