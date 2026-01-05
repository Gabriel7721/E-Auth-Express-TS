export type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  public status: number;
  public payload: ApiErrorPayload;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.status = status;
    this.payload = payload;
  }
}

export function ok<T>(data: T) {
  return { data };
}
