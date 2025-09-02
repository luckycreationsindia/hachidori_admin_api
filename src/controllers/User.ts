import * as UserService from "../services/User";
import {NextFunction, Request, Response} from "express";
import {ApiSuccessResponse} from "../interfaces/api-interface";
import ErrorHandler from "../utils/error_handler";
import {getIpAddress} from "../utils/util";
import * as jose from "jose";
import {z} from "zod";
import * as argon2 from "argon2";
import {prisma} from "../lib/prisma";

const TOKEN_EXPIRY_STR = process.env.TOKEN_EXPIRY || "1h";
const TOKEN_EXPIRY_MS = 1000 * 60 * 60;
const FAKE_HASH = 'O-+LV.Xwxbw\\ZtJhPuDWU4i:bLQv64ccGp)FK(l}"2qxE]9Ux@DPWe=aTa1pBw';

// --- REGISTER ---
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const registerSchema = z.object({
            name: z.string().min(1, "Name is required").trim(),
            email: z.email("Valid email is required").max(320).trim(),
            password: z.string().min(6, "Password must be at least 6 characters"),
        });

        const {name, email, password} = registerSchema.parse(req.body);

        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            secret: Buffer.from(process.env.ARGON_SECRET as string, "utf8"),
        });

        await UserService.createUser({name, email, password: hashedPassword});
        const response: ApiSuccessResponse = {status: 1};
        res.status(201).json(response);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const message = err.issues.map((issue) => issue.message).join(", ");
            next(new ErrorHandler(message, 400));
        } else {
            next(err);
        }
    }
}

// --- LOGIN ---
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const loginSchema = z.object({
            email: z.email("Valid email is required").trim(),
            password: z.string().min(1, "Password is required"),
        });

        const {email, password} = loginSchema.parse(req.body);
        const user = await UserService.getUserByEmailForAuth(email);

        const passwordValid = user
            ? await argon2.verify(user.password, password, {
                secret: Buffer.from(process.env.ARGON_SECRET as string, "utf8"),
            })
            : await argon2.verify(FAKE_HASH, password);

        if (!passwordValid || !user) {
            throw new ErrorHandler("Invalid email or password", 401);
        }

        if (!user.status) {
            throw new ErrorHandler("Account is deactivated", 403);
        }

        const token = await new jose.SignJWT({id: user.id})
            .setProtectedHeader({alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime(TOKEN_EXPIRY_STR)
            .setIssuer(process.env.JWT_ISSUER!)
            .setAudience(process.env.JWT_AUDIENCE!)
            .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

        const refreshToken = await new jose.SignJWT({id: user.id})
            .setProtectedHeader({alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime("7d")
            .setIssuer(process.env.JWT_ISSUER!)
            .setAudience(process.env.JWT_AUDIENCE!)
            .sign(new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_SECRET!));

        // Save refresh token in DB with Prisma
        await prisma.session.create({
            data: {
                userId: user.id,
                refreshToken,
                userAgent: req.get("user-agent") || "unknown",
                ip: getIpAddress(req),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
            maxAge: TOKEN_EXPIRY_MS,
        });

        res.cookie("rtoken", refreshToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res
            .status(200)
            .json({status: 1, message: "Login successful"});
    } catch (err) {
        if (err instanceof z.ZodError) {
            const message = err.issues.map((issue) => issue.message).join(", ");
            next(new ErrorHandler(message, 400));
        } else {
            next(err);
        }
    }
}

// --- LOGOUT ---
export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.signedCookies?.rtoken;
        if (refreshToken) {
            await prisma.session.deleteMany({where: {refreshToken}});
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
        });

        res.clearCookie("rtoken", {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
        });

        res.status(200).json({status: 1, message: "Logout successful"});
    } catch (err) {
        next(new ErrorHandler(String(err), 500));
    }
}

// --- PROFILE ---
export async function profile(req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.user) throw new ErrorHandler("Unauthorized Access", 401);
        res.status(200).json({status: 1, data: req.user});
    } catch (err) {
        next(new ErrorHandler(String(err), 500));
    }
}