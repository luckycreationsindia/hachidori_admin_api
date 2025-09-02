import {NextFunction, Request, Response} from "express";
import * as UserService from "../services/User";
import {IUser} from "../interfaces/user";
import {errors, JWTPayload, jwtVerify} from "jose";
import ErrorHandler from "../utils/error_handler";
import {Role} from '../utils/consts';

interface AuthOptions {
    role?: Role | Role[];
    optional?: boolean;
}

interface AuthPayload extends JWTPayload {
    id: string;
}

function handleAuthError(res: Response, err: any) {
    if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({status: -1, message: err.message});
    }
    return res.status(401).json({status: -1, message: "Unauthorized Access"});
}

export function authMiddleware(options: AuthOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let accessToken = req.signedCookies?.token;

        if (!accessToken && options.optional) {
            return next();
        }

        if (!accessToken) {
            return res.status(401).json({status: -1, message: "Unauthorized Access"});
        }

        try {
            const {payload} = await jwtVerify<AuthPayload>(
                accessToken,
                new TextEncoder().encode(process.env.JWT_SECRET!),
                {
                    issuer: process.env.JWT_ISSUER!,
                    audience: process.env.JWT_AUDIENCE!,
                    algorithms: ["HS256"]
                }
            );

            await attachUser(req, payload, options);
            return next();
        } catch (err) {
            if (err instanceof ErrorHandler) {
                return res.status(err.statusCode).json({status: -1, message: err.message});
            }
            if (err instanceof errors.JWTExpired) {
                const refreshToken = req.signedCookies?.rtoken;
                if (!refreshToken) {
                    return res.status(401).json({status: -1, message: "Unauthorized Access"});
                }

                try {
                    const {payload} = await jwtVerify<AuthPayload>(
                        refreshToken,
                        new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_SECRET!),
                        {
                            issuer: process.env.JWT_ISSUER!,
                            audience: process.env.JWT_AUDIENCE!,
                            algorithms: ["HS256"]
                        }
                    );

                    res.header("Refresh-Required", "true");
                    await attachUser(req, payload, options);

                    return next();
                } catch(err) {
                    return handleAuthError(res, err);
                }
            }

            return res.status(401).json({status: -1, message: "Unauthorized Access"});
        }
    };
}

async function attachUser(req: Request, payload: JWTPayload, options: AuthOptions) {
    const userId = parseInt(payload.id as string, 10);
    const user = await UserService.getUserById(userId);
    if (!user) throw new ErrorHandler("Unauthorized Access", 401);

    req.user = user as IUser;
    if (options.role !== undefined) {
        const roles = Array.isArray(options.role) ? options.role : [options.role];
        if (!roles.includes(user.role)) {
            throw new ErrorHandler("Forbidden", 403);
        }
    }
    req.locals = {...(req.locals || {}), isAdmin: isAdmin(req)};
}

export function isAdmin(req: Request) {
    const user = req.user;
    return user?.role === Role.ADMIN;
}