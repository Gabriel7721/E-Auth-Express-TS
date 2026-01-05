export type ApiErrorPayload = {
    message: string;
    code?: string;
    details?: unknown;
};
export declare class ApiError extends Error {
    status: number;
    payload: ApiErrorPayload;
    constructor(status: number, payload: ApiErrorPayload);
}
export declare function ok<T>(data: T): {
    data: T;
};
//# sourceMappingURL=http.d.ts.map