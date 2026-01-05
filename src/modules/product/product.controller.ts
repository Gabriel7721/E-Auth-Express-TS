import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
import { ApiError, ok } from "../../utils/http.js";

function toProductDto(p: any) {
  return {
    id: p._id.toString(),
    sku: p.sku,
    title: p.title,
    description: p.description,
    price: p.price,
    currency: p.currency,
    category: p.category,
    tags: p.tags,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function requireParam(req: Request, name: string): string {
  const v = req.params?.[name];
  if (typeof v !== "string" || v.trim() === "") {
    throw new ApiError(400, { message: `Missing or invalid param: ${name}` });
  }
  return v;
}

export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  create = async (req: Request, res: Response) => {
    const p = await this.productService.create(req.body);
    res.status(201).json(ok(toProductDto(p)));
  };
  
  list = async (req: Request, res: Response) => {
    const result = await this.productService.list(req.query as any);
    res.json(
      ok({
        ...result,
        items: result.items.map(toProductDto),
      })
    );
  };
  
  getById = async (req: Request, res: Response) => {
    const id = requireParam(req, "id");
    const p = await this.productService.getById(id);
    res.json(ok(toProductDto(p)));
  };
  
  patch = async (req: Request, res: Response) => {
    const id = requireParam(req, "id");
    const p = await this.productService.patch(id, req.body);
    res.json(ok(toProductDto(p)));
  };
  
  delete = async (req: Request, res: Response) => {
    const id = requireParam(req, "id");
    await this.productService.delete(id);
    res.json(ok({ deleted: true }));
  };
}
