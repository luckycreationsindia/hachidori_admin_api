import {defineConfig} from "tsdown";

export default defineConfig([
    {
        entry: ["src/server.ts"],
        format: ["cjs"],
        outDir: "dist",
        platform: "node",
        minify: true
    },
    {
        entry: ["src/utils/prisma_error.ts"],
        format: ["cjs"],
        outDir: "dist",
        platform: "node",
        minify: true
    },
    {
        entry: ["src/workers/worker_remove_expired_tokens.ts"],
        format: ["cjs"],
        outDir: "dist",
        platform: "node",
        minify: true
    }
]);