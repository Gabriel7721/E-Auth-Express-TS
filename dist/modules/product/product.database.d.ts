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
export declare class ProductDatabase {
    private col;
    create(doc: ProductDoc): Promise<ProductEntity>;
    findById(id: string): Promise<ProductEntity | null>;
    updateById(id: string, patch: Partial<ProductDoc>): Promise<ProductEntity | null>;
    deleteById(id: string): Promise<boolean>;
    list(query: ProductListQuery): Promise<{
        items: ProductEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
//# sourceMappingURL=product.database.d.ts.map