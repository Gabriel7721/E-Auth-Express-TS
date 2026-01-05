import { ApiError } from "../utils/http.js";
import { verifyAccessToken } from "../utils/jwt.js";
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new ApiError(401, { message: "Missing authorization Bearer" });
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = verifyAccessToken(token);
        req.auth = { userId: payload.sub, role: payload.role };
        next();
    }
    catch (error) {
        throw new ApiError(401, { message: "Invalid or Expired access token." });
    }
}
export function requireRole(role) {
    return (req, _res, next) => {
        if (!req.auth)
            throw new ApiError(401, { message: "UnAuthorized" });
        if (req.auth.role !== role) {
            throw new ApiError(403, { message: "Forbidden" });
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map