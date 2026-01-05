export type UserRole = "customer" | "admin";
export type UserDoc = {
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=user.model.d.ts.map