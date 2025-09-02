export interface IRequestLocals {
    isAdmin?: boolean;
    user?: any;
    userId?: string;
}

export interface BulkResult {
    success: { error: null; data: any }[];
    failed: { error: string; data: any }[];
}