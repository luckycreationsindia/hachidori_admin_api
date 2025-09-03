import {Prisma} from "@prisma/client";

class ErrorHandler extends Error {
    statusCode: number;
    status: 'fail' | 'error';

    constructor(message: string | Error, statusCode: number = 500) {
        let finalMessage: string;
        let isClientError = false;

        finalMessage = message instanceof Error ? message.message : String(message);

        const finalStatusCode: number = isClientError ? 400 : statusCode;

        super(finalMessage);
        this.statusCode = finalStatusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Capturing the stack trace for better debugging.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export function translatePrismaError(err: unknown): ErrorHandler {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                const target = (err.meta?.target as string[])?.[0] ?? "field";
                return new ErrorHandler(`${target} already exists`, 400);
            }
            case "P2003":
                return new ErrorHandler("Invalid reference to another record", 400);
            case "P2025":
                return new ErrorHandler("Record not found", 404);
            default:
                return new ErrorHandler(`Database error: ${err.message}`, 500);
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return new ErrorHandler("Invalid data provided", 400);
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
        return new ErrorHandler("Database connection failed", 500);
    }

    // Not a Prisma error, wrap generic
    return new ErrorHandler(err instanceof Error ? err.message : String(err), 500);
}
