import {Role} from '../utils/consts';

export interface IUser {
    id: number;
    name?: string;
    email: string;
    password: string;
    role: Role;
    status?: boolean | undefined;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserQuery {
    status?: boolean;
    search?: string;
    email?: string;
    name?: string;
    role?: Role;
    page?: number;
    limit?: number;
    minimal?: boolean;
}