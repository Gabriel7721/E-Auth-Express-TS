import { ApiError } from "../utils/http.js";
export function errorMiddleware(err, _req, res, _next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ error: err.payload });
    }
    return res.status(500).json({ error: { message: "Internal Server Error" } });
}
//# sourceMappingURL=error.middleware.js.map