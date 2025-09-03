/// <reference path="./types/express.d.ts" />
/// <reference path="./types/global.d.ts" />
import dotenv from 'dotenv';

dotenv.config({quiet: true});
import express, {Request, Response, type Express, NextFunction} from 'express';
import cookieParser from "cookie-parser";
import Routes from './routes';
import {networkHandler} from './utils/logger';
import {startExpiredTokensWorker} from "./workers";
import ErrorHandler from "./utils/error_handler";
import {rateLimit} from "express-rate-limit";
import {getIpAddress} from "./utils/util";
import {errorMiddleware} from "./middlewares/error_middleware";

const whitelist = (process.env.RATE_LIMIT_WHITELIST || "")
    .split(",")
    .map(ip => ip.trim())
    .filter(Boolean);

const limiter = rateLimit({
    windowMs: 60 * 1000 * 1, //1 min
    limit: 100,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many requests", 429));
    },
    keyGenerator: (req: Request, res: Response) => {
        const finalIp = getIpAddress(req);
        if (!finalIp) {
            res.status(400).json({status: -1, message: "Invalid IP"});
            return '';
        }
        return finalIp;
    },
    skip: (req: Request, res: Response) => {
        const finalIp = getIpAddress(req);
        if (!finalIp) {
            res.status(400).json({status: -1, message: "Invalid IP"});
            return false;
        }
        return whitelist.includes(finalIp);
    },
});

const app: Express = express();
app.set('trust proxy', true);
app.use(limiter);

app.use(networkHandler);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));

app.get('/', (req: Request, res: Response) => res.json({status: 1}));

app.use('/v1', Routes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ErrorHandler("Not Found", 404));
});

app.use(errorMiddleware)

startExpiredTokensWorker();

export default app;