import {Worker} from "worker_threads";
import logger from "../utils/logger";
import path from "path";

export function startExpiredTokensWorker() {
    const workerData = {DATABASE_URL: process.env.DATABASE_URL, rootDir: __dirname};

    const workerFilePath = path.join(
        __dirname,
        process.env.NODE_ENV === "production"
            ? "worker_remove_expired_tokens.js"
            : "worker_remove_expired_tokens.ts"
    );

    const workerOptions = {
        workerData,
        execArgv: ["--no-warnings"]
    }

    const worker = new Worker(
        workerFilePath,
        workerOptions,
    );

    worker.on("message", (message) => {
        logger.info('[EXPIRED_TOKEN_WORKER]', message);
    });

    worker.on("error", (err) => {
        logger.error(err, '[EXPIRED_TOKEN_WORKER]');
    });

    worker.on("exit", (code) => {
        logger.info(`[EXPIRED_TOKEN_WORKER] Exited with code ${code}`);
        if (code !== 0) {
            logger.warn("[EXPIRED_TOKEN_WORKER] Restarting...");
            setTimeout(() => startExpiredTokensWorker(), 2000);
        }
    });
}