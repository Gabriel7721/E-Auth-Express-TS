import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create: (req: Request, res: Response) => Promise<void>;
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    patch: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map