import { ok } from "../../utils/http.js";
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    toUserDto(user) {
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    list = async (_req, res) => {
        const users = await this.userService.list();
        res.json({ data: users });
    };
    register = async (req, res) => {
        const { email, password, role } = req.body;
        const user = await this.userService.register({ email, password, role });
        res.status(201).json(ok(this.toUserDto(user)));
    };
    // GET One By Email & GET One By ObjectId
    // PUT One By ObjectId
    // DELETE One By ObjectId
    getById = async (req, res) => {
        const userId = req.params.id;
        const user = await this.userService.getById(userId);
        res.json(ok(this.toUserDto(user)));
    };
    getByEmail = async (req, res) => {
        const userEmail = req.params.email;
        const user = await this.userService.getByEmail(userEmail);
        res.json(ok({ data: user.email }));
    };
    updatePut = async (req, res) => {
        const userId = req.params.id;
        const { email, password, role } = req.body;
        const user = await this.userService.updatePut(userId, {
            email,
            password,
            role,
        });
        res.json(ok(this.toUserDto(user)));
    };
    updatePatch = async (req, res) => {
        const userId = req.params.id;
        const { email, password, role } = req.body;
        const user = await this.userService.updatePatch(userId, {
            email,
            password,
            role,
        });
        res.json(ok(this.toUserDto(user)));
    };
    delete = async (req, res) => {
        const userId = req.params.id;
        await this.userService.delete(userId);
        res.status(204).send();
    };
}
//# sourceMappingURL=user.controller.js.map