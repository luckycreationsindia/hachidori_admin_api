import pino from 'pino';
import pinoHTTP from "pino-http";
import {randomUUID} from "node:crypto";

const isDev = process.env.NODE_ENV !== 'production';

const targets: pino.TransportTargetOptions[] = [
    {
        target: 'pino-roll',
        options: {
            file: './logs/logging.txt',
            size: '10m',
            frequency: 'daily',
            limit: {
                count: 30,
                removeOtherLogFiles: true,
            }
        },
        level: 'info',
    }
];

if (isDev) {
    targets.push({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            singleLine: true,
            messageFormat: `[LOG] - [${new Date().toLocaleString()}] - {msg}`,
        },
        level: 'debug'
    });
}

const transport = pino.transport({
    targets
});

const logger = pino(transport);

export const networkHandler = pinoHTTP({
    logger,
    genReqId: function (req, res) {
        const existingID = req.id ?? req.headers["x-request-id"]
        if (existingID) return existingID
        const id = randomUUID()
        res.setHeader('X-Request-Id', id)
        return id
    },
    customLogLevel: function (req, res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn'
        } else if (res.statusCode >= 500 || err) {
            return 'error'
        } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'silent'
        }
        return 'info'
    },
    customSuccessMessage: function (req, res) {
        // @ts-ignore
        const userId = req.user?._id || 'N/A';
        if (res.statusCode === 404) {
            return `[NOT FOUND][USER-${userId}]`
        } else if (res.statusCode === 403) {
            return `[FORBIDDEN][USER-${userId}]`
        } else if (res.statusCode === 401) {
            return `[UNAUTHORIZED][USER-${userId}]`
        } else if (res.statusCode === 500) {
            return `[ERROR][USER-${userId}]`
        } else if (res.statusCode === 400) {
            return `[BAD REQUEST][USER-${userId}]`
        }
        return `[COMPLETED][USER-${userId}]`
    },
    customErrorMessage: function (req, res, err) {
        // @ts-ignore
        const userId = req.user?._id || 'N/A';
        if (res.statusCode === 404) {
            return `[NOT FOUND][USER-${userId}]`
        } else if (res.statusCode === 403) {
            return `[FORBIDDEN][USER-${userId}]`
        } else if (res.statusCode === 401) {
            return `[UNAUTHORIZED][USER-${userId}]`
        } else if (res.statusCode === 500) {
            return `[ERROR][USER-${userId}]`
        } else if (res.statusCode === 400) {
            return `[BAD REQUEST][USER-${userId}]`
        }
        return `[ERROR][USER-${userId}]`
    }
})

export default logger;