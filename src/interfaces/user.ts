export interface IUser {
    id: number;
    name?: string;
    email: string;
    password: string;
    role: number;
    status?: boolean | undefined;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserQuery {
    status?: boolean;
    search?: string;
    email?: string;
    name?: string;
    role?: number;
    page?: number;
    limit?: number;
    minimal?: boolean;
}