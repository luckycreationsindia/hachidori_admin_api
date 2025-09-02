import {Request, Response, NextFunction} from "express";
import ErrorHandler from "../utils/error_handler";
import {ApiErrorResponse} from "../interfaces/api-interface";
import {Prisma} from "@prisma/client";
import {z} from "zod";

export function errorMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    let error: ErrorHandler;
    if (err instanceof ErrorHandler) {
        error = err;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                const target = (err.meta?.target as string[])?.[0] ?? "field";
                error = new ErrorHandler(`${target} already exists`, 400);
                break;
            }
            case "P2003":
                error = new ErrorHandler("Invalid reference to another record", 400);
                break;
            case "P2025":
                error = new ErrorHandler("Record not found", 404);
                break;
            default:
                error = new ErrorHandler(`Database error: ${err.message}`, 500);
        }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        error = new ErrorHandler("Invalid data provided", 400);
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        error = new ErrorHandler("Database connection failed", 500);
    } else if (err instanceof z.ZodError) {
        const message = err.issues.map((issue) => issue.message).join(", ");
        error = new ErrorHandler(message, 400);
    } else if (err instanceof Error) {
        error = new ErrorHandler(err.message, 500);
    } else {
        error = new ErrorHandler("Unexpected error occurred", 500);
    }

    res.status(error.statusCode).json({
        status: -1,
        message: error.message,
    } as ApiErrorResponse)
}