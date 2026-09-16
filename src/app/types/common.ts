import type { userRole } from "../../generated/client/enums";

export type IJwtPayload = {
    email: string;
    role: userRole
}