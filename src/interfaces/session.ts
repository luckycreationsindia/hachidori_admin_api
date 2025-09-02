export interface ISession {
    id: number;
    user: string;
    refreshToken: string;
    userAgent: string;
    ip: string;
    createdAt: Date;
    expiresAt: Date;
}