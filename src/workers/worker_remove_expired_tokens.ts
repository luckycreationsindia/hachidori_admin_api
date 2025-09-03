import {parentPort, workerData} from "worker_threads";

if (!workerData?.DATABASE_URL) {
    console.error("REMOVE_EXPIRED_TOKENS_WORKER: Missing DATABASE_URL in workerData");
    process.exit(1);
}

const rootDir = workerData.rootDir;

process.env.DATABASE_URL = workerData.DATABASE_URL;

import path from "path";
import {pathToFileURL} from "url";
import {PrismaClient} from '@prisma/client'

(async () => {
    console.log("REMOVE_EXPIRED_TOKENS_WORKER: Starting...");

    const prisma = new PrismaClient({
        log: ['error', 'warn'],
    })

    const translatePrismaErrorPath = pathToFileURL(path.join(
        rootDir,
        process.env.NODE_ENV === "production" ? 'prisma_error.js' : '../utils/prisma_error.ts'
    )).toString();

    try {
        await prisma.$connect();
        console.log("REMOVE_EXPIRED_TOKENS_WORKER: Connected to DB.");
    } catch (err) {
        console.error("REMOVE_EXPIRED_TOKENS_WORKER: Error connecting:", err);
        process.exit(1);
    }

    const {translatePrismaError} = await import(translatePrismaErrorPath);

    async function removeExpiredTokens() {
        try {
            const result = await prisma.session.deleteMany({
                where: {
                    expiresAt: {lt: new Date()}
                }
            });
            if (result.count > 0) {
                const message = `Cleanup complete. Removed ${result.count} expired sessions.`;
                console.log(message);
                parentPort?.postMessage({status: true, message});
            }
        } catch (err) {
            const error = translatePrismaError(err);
            console.error("Error during cleanup:", error);
            parentPort?.postMessage({status: false, message: "Error during cleanup", error: error.message});
        }
    }

    async function loop() {
        await removeExpiredTokens();
        setTimeout(loop, Number(process.env.TOKEN_CLEANUP_INTERVAL ?? 1000 * 60 * 60));
    }

    loop();

    const cleanup = async () => {
        console.log("REMOVE_EXPIRED_TOKENS_WORKER: Shutting down...");
        await prisma.$disconnect();
        process.exit(0);
    };

    process.on("SIGTERM", cleanup);
    process.on("SIGINT", cleanup);
    parentPort?.on("close", cleanup);
    console.log("REMOVE_EXPIRED_TOKENS_WORKER: Started...");
})();
