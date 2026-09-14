import { PrismaPg } from "@prisma/adapter-pg";
import { envVars } from "../config";
import { PrismaClient } from "../../generated/client/client";

const adapter = new PrismaPg({
    connectionString: envVars.database_url
})

export const prisma = new PrismaClient({
    adapter,
})