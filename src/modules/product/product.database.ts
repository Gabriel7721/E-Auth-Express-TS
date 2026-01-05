import { ObjectId, type Filter, type Sort } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { ProductDoc, ProductEntity } from "./product.model.js";

export type ProductListQuery = {
  q?: string;

  category?: string;
  tags?: string[]; 
  status?: "active" | "inactive";

  minPrice?: number;
  maxPrice?: number;

  sort?: "newest" | "price_asc" | "price_desc";
  page: number;
  limit: number;
};

export class ProductDatabase {
  private col() {
    return getDb().collection<ProductDoc>("products");
  }

  async create(doc: ProductDoc): Promise<ProductEntity> {
    const res = await this.col().insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.col().findOne({
      _id: new ObjectId(id),
    }) as Promise<ProductEntity | null>;
  }

  async updateById(
    id: string,
    patch: Partial<ProductDoc>
  ): Promise<ProductEntity | null> {
    const updated = await this.col().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: patch },
      { returnDocument: "after" }
    );

    return updated as ProductEntity | null;
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this.col().deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount === 1;
  }

  async list(query: ProductListQuery): Promise<{
    items: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const filter: Filter<ProductDoc> = {};

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
    }

    if (query.q && query.q.trim().length > 0) {
      filter.$text = { $search: query.q.trim() };
    }

    const sort: Sort = (() => {
      switch (query.sort) {
        case "price_asc":
          return { price: 1, _id: -1 };
        case "price_desc":
          return { price: -1, _id: -1 };
        case "newest":
        default:
          return { createdAt: -1, _id: -1 };
      }
    })();

    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const cursor = this.col().find(filter).sort(sort).skip(skip).limit(limit);
    const [items, total] = await Promise.all([
      cursor.toArray() as Promise<ProductEntity[]>,
      this.col().countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, total, page, limit, totalPages };
  }
}
