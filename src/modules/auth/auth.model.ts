import type { ObjectId } from "mongodb";

export type RefreshTokenDoc = {
  userId: ObjectId;
  tokenId: string;
  issuedAt: Date;
  expiresAt: Date;

  revokedAt?: Date;
  replacedByTokenId?: string;

  userAgent?: string;
  ip?: string;
};
