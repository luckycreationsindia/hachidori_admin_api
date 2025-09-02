export interface ApiSuccessResponse {
    status: number;
    message?: string;
    data?: any;
}

export interface ApiErrorResponse {
    status: number;
    message: string;
}