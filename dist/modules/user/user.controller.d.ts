import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    private toUserDto;
    list: (_req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    getByEmail: (req: Request, res: Response) => Promise<void>;
    updatePut: (req: Request, res: Response) => Promise<void>;
    updatePatch: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map