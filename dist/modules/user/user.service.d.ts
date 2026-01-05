import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserRole } from "./user.model.js";
export declare class UserService {
    private readonly userDb;
    constructor(userDb: UserDatabase);
    private normalizeEmail;
    private assertEmailValid;
    private assertEmailUnique;
    private assertPasswordValid;
    private requireUserById;
    list(): Promise<UserEntity[]>;
    getById(userId: string): Promise<UserEntity>;
    getByEmail(userEmail: string): Promise<UserEntity>;
    register(input: {
        email: string;
        password: string;
        role?: UserRole;
    }): Promise<UserEntity>;
    updatePut(userId: string, input: {
        email: string;
        password: string;
        role: UserRole;
    }): Promise<UserEntity>;
    updatePatch(userId: string, input: {
        email?: string;
        password?: string;
        role?: UserRole;
    }): Promise<UserEntity>;
    delete(userId: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map