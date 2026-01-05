import type { UserDatabase } from "../user/user.database.js";
import type { AuthDatabase } from "./auth.database.js";
export declare class AuthService {
    private readonly userDb;
    private readonly authDb;
    constructor(userDb: UserDatabase, authDb: AuthDatabase);
    login(input: {
        email: string;
        password: string;
        userAgent?: string;
        ip?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map