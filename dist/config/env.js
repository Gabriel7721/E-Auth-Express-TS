import dotenv from "dotenv";
dotenv.config();
function required(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env: ${name}`);
    return v;
}
function numberEnv(name, fallback) {
    const v = process.env[name];
    if (!v)
        return fallback;
    const n = Number(v);
    if (!Number.isFinite(n))
        throw new Error(`Invalid number env: ${name}`);
    return n;
}
export const env = {
    nodeEnv: process.env.NODE_ENV,
    port: numberEnv("PORT", 9999),
    mongoUri: required("MONGODB_URI"),
    mongoDb: required("MONGODB_DB"),
    jwtAccessSecret: required("JWT_ACCESS_SECRET"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
    accessTokenTtlSeconds: numberEnv("ACCESS_TOKEN_TTL_SECONDS", 3600),
    refreshTokenTtlSeconds: numberEnv("REFRESH_TOKEN_TTL_SECONDS", 72000),
    refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'rt',
};
//# sourceMappingURL=env.js.map