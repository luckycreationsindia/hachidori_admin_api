import {NextFunction, Request, Response} from "express";
import {ApiSuccessResponse} from "../interfaces/api-interface";
import ErrorHandler from "../utils/error_handler";
import {jwtVerify, SignJWT} from "jose";
import {prisma} from "../lib/prisma";

export async function refreshSession(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.signedCookies?.rtoken;
    if (!refreshToken) {
        return res.status(401).json({status: -1, message: "Unauthorized Access"});
    }
    try {
        const {payload} = await jwtVerify(
            refreshToken,
            new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_SECRET!),
            {
                issuer: process.env.JWT_ISSUER!,
                audience: process.env.JWT_AUDIENCE!,
                algorithms: ["HS256"]
            }
        );

        const session = await prisma.session.findUnique({
            where: {refreshToken},
        });
        if (!session || new Date() > session.expiresAt) {
            return res.status(401).json({status: -1, message: "Session Expired"});
        }

        const newAccessToken = await new SignJWT({id: payload.id})
            .setProtectedHeader({alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime("15m")
            .setIssuer(process.env.JWT_ISSUER!)
            .setAudience(process.env.JWT_AUDIENCE!)
            .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

        const newRefreshToken = await new SignJWT({id: payload.id})
            .setProtectedHeader({alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime("7d")
            .setIssuer(process.env.JWT_ISSUER!)
            .setAudience(process.env.JWT_AUDIENCE!)
            .sign(new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_SECRET!));

        await prisma.session.update({
            where: {refreshToken},
            data: {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("rtoken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const response: ApiSuccessResponse = {status: 1};
        res.status(200).json(response);
    } catch (err) {
        next(new ErrorHandler(String(err), 500));
    }
}