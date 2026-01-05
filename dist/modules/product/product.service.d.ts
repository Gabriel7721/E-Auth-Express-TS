import type { ProductDatabase } from "./product.database.js";
export declare class ProductService {
    private readonly productDb;
    constructor(productDb: ProductDatabase);
    create(input: {
        sku: string;
        title: string;
        description: string;
        price: number;
        currency: "USD" | "VND";
        category: string;
        tags?: string[];
        status?: "active" | "inactive";
    }): Promise<import("./product.model.js").ProductEntity>;
    getById(id: string): Promise<import("./product.model.js").ProductEntity>;
    list(input: {
        q?: string;
        category?: string;
        tags?: string;
        status?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        items: import("./product.model.js").ProductEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    patch(id: string, input: Partial<{
        sku: string;
        title: string;
        description: string;
        price: number;
        currency: "USD" | "VND";
        category: string;
        tags: string[];
        status: "active" | "inactive";
    }>): Promise<import("./product.model.js").ProductEntity>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=product.service.d.ts.map