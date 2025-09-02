import {prisma} from "../lib/prisma";
import {IUser, IUserQuery} from '../interfaces/user';

// ---- CREATE USER ----
export async function createUser(data: Partial<IUser>): Promise<IUser> {
    const newUser = await prisma.user.create({data: data as any});
    return prisma.user.findUnique({
        where: {id: newUser.id},
        select: {password: false} as any,
    }) as unknown as IUser;
}

// ---- UPDATE USER ----
export async function updateUser(id: number, data: Partial<IUser>): Promise<IUser | null> {
    return prisma.user.update({
        where: {id},
        data: data as any,
        select: {password: false} as any,
    }) as unknown as IUser | null;
}

// ---- GET USERS ----
export async function getUsers(query?: IUserQuery): Promise<IUser[]> {
    const where: any = {};

    if (query?.status !== undefined) where.status = query.status;

    if (query?.search) {
        where.OR = [
            {email: {contains: query.search, mode: 'insensitive'}},
            {name: {contains: query.search, mode: 'insensitive'}},
        ];
    } else {
        if (query?.email) where.email = {contains: query.email, mode: 'insensitive'};
        if (query?.name) where.name = {contains: query.name, mode: 'insensitive'};
    }

    const select = query?.minimal
        ? {id: true, name: true, email: true}
        : {password: false} as any;

    const take = query?.limit ?? undefined;
    const skip = query?.page && take ? (query.page - 1) * take : undefined;

    return prisma.user.findMany({
        where,
        select,
        orderBy: {createdAt: 'desc'},
        ...(skip !== undefined && {skip}),
        ...(take !== undefined && {take}),
    }) as unknown as IUser[];
}

// ---- COUNT USERS ----
export async function getUsersCount(query?: IUserQuery): Promise<number> {
    const where: any = {isDeleted: false};

    if (query?.status !== undefined) where.status = query.status;
    if (query?.search) {
        where.OR = [
            {email: {contains: query.search, mode: 'insensitive'}},
            {name: {contains: query.search, mode: 'insensitive'}},
        ];
    } else {
        if (query?.email) where.email = {contains: query.email, mode: 'insensitive'};
        if (query?.name) where.name = {contains: query.name, mode: 'insensitive'};
    }

    return prisma.user.count({where});
}

// ---- PAGINATION ----
export async function getUsersWithPagination(query?: IUserQuery) {
    const page = Math.max(1, query?.page || 1);
    const limit = Math.min(100, Math.max(1, query?.limit || 10));

    const [users, total] = await Promise.all([
        getUsers({...query, page, limit}),
        getUsersCount(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}

// ---- FIND USER ----
export async function getUserById(id: number): Promise<IUser | null> {
    return prisma.user.findFirst({
        where: {id},
        select: {password: false} as any,
    }) as unknown as IUser | null;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findFirst({
        where: {email},
        select: {password: false} as any,
    }) as unknown as IUser | null;
}

export async function getUserByEmailForAuth(email: string): Promise<IUser | null> {
    return prisma.user.findFirst({
        where: {email},
    }) as unknown as IUser | null;
}

// ---- UPDATE STATUS ----
export async function updateUserStatus(id: number, status: boolean): Promise<IUser | null> {
    return prisma.user.update({
        where: {id},
        data: {status},
        select: {password: false} as any,
    }) as unknown as IUser | null;
}

// ---- CHANGE PASSWORD ----
export async function changeUserPassword(id: number, newPassword: string): Promise<boolean> {
    const result = await prisma.user.update({
        where: {id},
        data: {password: newPassword},
    });
    return !!result;
}

// ---- CHECK EMAIL EXISTS ----
export async function checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
    const where: any = {email, isDeleted: false};
    if (excludeId) where.id = {not: excludeId};

    const count = await prisma.user.count({where});
    return count > 0;
}
