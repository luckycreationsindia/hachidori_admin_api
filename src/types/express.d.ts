import {IUser} from "../interfaces/user";

declare global {
    namespace Express {
        export interface Request {
            user?: IUser,
            locals?: {
                isAdmin?: boolean;
                [key: string]: any;
            };
        }
    }
}

export type Locals = {
    isAdmin?: boolean;
    [key: string]: any;
};