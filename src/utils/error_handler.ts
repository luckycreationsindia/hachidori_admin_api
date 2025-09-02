// A type guard to check if an object has a `code` property
function hasCode(err: unknown): err is { code: number } {
    return typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code: unknown }).code === 'number';
}

/**
 * A custom error class for handling application-specific errors with HTTP status codes.
 * This class is designed to handle errors gracefully, including those from Mongoose.
 */
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

export default ErrorHandler;
