import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
    migrations: {
        seed: `ts-node ${path.join("prisma", "seed.ts")}`,
    }
} satisfies PrismaConfig;