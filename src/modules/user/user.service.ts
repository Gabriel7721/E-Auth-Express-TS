import { hashPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserRole } from "./user.model.js";

export class UserService {
  constructor(private readonly userDb: UserDatabase) {}

  private normalizeEmail(raw: string): string {
    return raw.trim().toLowerCase();
  }

  private assertEmailValid(email: string): void {
    if (!email.includes("@"))
      throw new ApiError(400, { message: "Invalid Email." });
  }

  private async assertEmailUnique(
    email: string,
    currentEmail?: string
  ): Promise<void> {
    if (currentEmail && email === currentEmail) return;
    const existed = await this.userDb.findByEmail(email);
    if (existed) throw new ApiError(409, { message: "Email already exists." });
  }

  private assertPasswordValid(pw: string): void {
    if (pw.length < 6)
      throw new ApiError(400, {
        message: "Password must be at least 6 characters.",
      });

    if (!/[A-Z]/.test(pw))
      throw new ApiError(400, {
        message: "Password must contain an uppercase letter.",
      });

    if (!/[^\w\s]/.test(pw))
      throw new ApiError(400, {
        message: "Password must contain a special character.",
      });
  }

  private async requireUserById(userId: string): Promise<UserEntity> {
    const u = await this.userDb.findById(userId);
    if (!u) throw new ApiError(404, { message: "User ID not found" });``
    return u;
  }

  async list() {
    return this.userDb.list();
  }

  async getById(userId: string): Promise<UserEntity> {
    const u = await this.userDb.findById(userId);
    if (!u) throw new ApiError(404, { message: "User ID not found" });
    return u;
  }

  async getByEmail(userEmail: string): Promise<UserEntity> {
    const u = await this.userDb.findByEmail(userEmail);
    if (!u) throw new ApiError(404, { message: "User Email not found" });
    return u;
  }

  async register(input: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<UserEntity> {
    const email = this.normalizeEmail(input.email);
    this.assertEmailValid(email);
    await this.assertEmailUnique(email);

    this.assertPasswordValid(input.password);

    const now = new Date();
    const passwordHash = await hashPassword(input.password);
    const role: UserRole = input.role ?? "customer";

    return this.userDb.create({
      email,
      passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updatePut(
    userId: string,
    input: { email: string; password: string; role: UserRole }
  ): Promise<UserEntity> {
    const current = await this.requireUserById(userId);

    const email = this.normalizeEmail(input.email);
    this.assertEmailValid(email);
    await this.assertEmailUnique(email, current.email);

    this.assertPasswordValid(input.password);

    const now = new Date();
    const passwordHash = await hashPassword(input.password);

    const updated = await this.userDb.updateById(userId, {
      email,
      passwordHash,
      role: input.role,
      updatedAt: now,
    });
    if (!updated) throw new ApiError(404, { message: "User ID not found" });
    return updated;
  }

  async updatePatch(
    userId: string,
    input: { email?: string; password?: string; role?: UserRole }
  ): Promise<UserEntity> {
    const current = await this.requireUserById(userId);

    const set: Partial<
      Pick<UserEntity, "email" | "passwordHash" | "role" | "updatedAt">
    > = {};
    const now = new Date();

    if (input.email !== undefined) {
      const email = this.normalizeEmail(input.email);
      this.assertEmailValid(email);
      await this.assertEmailUnique(email, current.email);
      set.email = email;
    }

    if (input.password !== undefined) {
      this.assertPasswordValid(input.password);
      set.passwordHash = await hashPassword(input.password);
    }

    if (input.role !== undefined) {
      set.role = input.role;
    }

    if (Object.keys(set).length === 0) {
      throw new ApiError(400, { message: "No fields to update." });
    }

    set.updatedAt = now;

    const updated = await this.userDb.updateById(userId, set);
    if (!updated) throw new ApiError(404, { message: "User ID not found" });
    return updated;
  }

  async delete(userId: string): Promise<void> {
    const ok = await this.userDb.deleteById(userId);
    if (!ok) throw new ApiError(404, { message: "User ID not found" });
  }
}
