export class ApiError extends Error {
    status;
    payload;
    constructor(status, payload) {
        super(payload.message);
        this.status = status;
        this.payload = payload;
    }
}
export function ok(data) {
    return { data };
}
//# sourceMappingURL=http.js.map