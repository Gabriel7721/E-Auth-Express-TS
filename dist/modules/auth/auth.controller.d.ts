import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.js";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login: (req: Request, res: Response) => Promise<void>;
    refresh: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map