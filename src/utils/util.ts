import {Request} from "express";

export function checkAndGetBoolean(value: string | boolean | undefined) {
    if (!value) return false;
    if (typeof value === "string") {
        return value === "true" || value === "1";
    } else {
        return value;
    }
}

export function assignField<T, K extends keyof T>(
    obj: Partial<T>,
    key: K,
    value: T[K]
): void {
    if (value !== undefined) {
        obj[key] = value;
    }
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Retrieves the client's IP address from the request object.
 *
 * @param {Object} req - The request object containing client information.
 * @returns {string} The IP address of the client.
 */
export function getIpAddress(req: Request): string {
    let ipAddress: string | undefined =
        (req.headers["cf-connecting-ip"] as string | undefined) ||
        (req.headers["x-forwarded-for"] as string | undefined) ||
        (req.ip as string | undefined);

    if (ipAddress) {
        const i = ipAddress.indexOf(",");
        if (i !== -1) ipAddress = ipAddress.slice(0, i).trim();
        if (ipAddress.startsWith("::ffff:")) ipAddress = ipAddress.substring(7);
    }

    return ipAddress || "";
}