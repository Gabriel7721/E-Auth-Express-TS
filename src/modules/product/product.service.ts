import { ApiError } from "../../utils/http.js";
import type { ProductDatabase, ProductListQuery } from "./product.database.js";
import type { ProductDoc } from "./product.model.js";

export class ProductService {
  constructor(private readonly productDb: ProductDatabase) {}

  async create(input: {
    sku: string;
    title: string;
    description: string;
    price: number;
    currency: "USD" | "VND";
    category: string;
    tags?: string[];
    status?: "active" | "inactive";
  }) {
    if (!input.sku?.trim())
      throw new ApiError(400, { message: "sku is required" });
    if (!input.title?.trim())
      throw new ApiError(400, { message: "title is required" });
    if (typeof input.price !== "number" || input.price < 0)
      throw new ApiError(400, {
        message: "price must be a non-negative number",
      });

    const now = new Date();
    const doc: ProductDoc = {
      sku: input.sku.trim(),
      title: input.title.trim(),
      description: (input.description ?? "").trim(),
      price: input.price,
      currency: input.currency,
      category: input.category.trim(),
      tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
      status: input.status ?? "active",
      createdAt: now,
      updatedAt: now,
    };

    return this.productDb.create(doc);
  }

  async getById(id: string) {
    const p = await this.productDb.findById(id);
    if (!p) throw new ApiError(404, { message: "Product not found" });
    return p;
  }

  async list(input: {
    q?: string;
    category?: string;
    tags?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }) {
    const page = parsePositiveInt(input.page, 1, 1_000_000);
    const limit = parsePositiveInt(input.limit, 20, 100);

    const status =
      input.status === "active" || input.status === "inactive"
        ? input.status
        : undefined;

    const tags =
      input.tags
        ?.split(",")
        .map((x) => x.trim())
        .filter(Boolean) ?? undefined;

    const minPrice = parseOptionalNumber(input.minPrice);
    const maxPrice = parseOptionalNumber(input.maxPrice);
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new ApiError(400, {
        message: "minPrice cannot be greater than maxPrice",
      });
    }

    const sort =
      input.sort === "newest" ||
      input.sort === "price_asc" ||
      input.sort === "price_desc"
        ? input.sort
        : "newest";

    const dbQuery: ProductListQuery = {
      page,
      limit,
      sort,
      ...(input.q?.trim() ? { q: input.q.trim() } : {}),
      ...(input.category?.trim() ? { category: input.category.trim() } : {}),
      ...(tags && tags.length > 0 ? { tags } : {}),
      ...(status ? { status } : {}),
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
    };
    return this.productDb.list(dbQuery);
  }

  async patch(
    id: string,
    input: Partial<{
      sku: string;
      title: string;
      description: string;
      price: number;
      currency: "USD" | "VND";
      category: string;
      tags: string[];
      status: "active" | "inactive";
    }>
  ) {
    const patch: Partial<ProductDoc> = {};
    if (input.sku !== undefined) patch.sku = input.sku.trim();
    if (input.title !== undefined) patch.title = input.title.trim();
    if (input.description !== undefined)
      patch.description = input.description.trim();
    if (input.price !== undefined) {
      if (typeof input.price !== "number" || input.price < 0)
        throw new ApiError(400, {
          message: "price must be a non-negative number",
        });
      patch.price = input.price;
    }
    if (input.currency !== undefined) patch.currency = input.currency;
    if (input.category !== undefined) patch.category = input.category.trim();
    if (input.tags !== undefined)
      patch.tags = input.tags.map((t) => t.trim()).filter(Boolean);
    if (input.status !== undefined) patch.status = input.status;

    patch.updatedAt = new Date();

    const updated = await this.productDb.updateById(id, patch);
    if (!updated) throw new ApiError(404, { message: "Product not found" });
    return updated;
  }

  async delete(id: string) {
    const ok = await this.productDb.deleteById(id);
    if (!ok) throw new ApiError(404, { message: "Product not found" });
    return true;
  }
}

function parsePositiveInt(
  v: string | undefined,
  fallback: number,
  max: number
) {
  if (!v) return fallback;
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) return fallback;
  return Math.min(n, max);
}

function parseOptionalNumber(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return n;
}
