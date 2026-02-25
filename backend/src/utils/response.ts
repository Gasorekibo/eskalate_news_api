export interface BaseResponse<T = any> {
    Success: boolean;
    Message: string;
    Object: T | null;
    Errors: string[] | null;
}

export interface PaginatedResponse<T = any> {
    Success: boolean;
    Message: string;
    Object: T[];
    PageNumber: number;
    PageSize: number;
    TotalSize: number;
    Errors: string[] | null;
}

export const successResponse = (message: string, object: any = null): BaseResponse => ({
    Success: true,
    Message: message,
    Object: object,
    Errors: null,
});

export const errorResponse = (message: string, errors: string[] | null = null): BaseResponse => ({
    Success: false,
    Message: message,
    Object: null,
    Errors: errors,
});

export const paginatedResponse = (
    message: string,
    objects: any[],
    pageNumber: number,
    pageSize: number,
    totalSize: number
): PaginatedResponse => ({
    Success: true,
    Message: message,
    Object: objects,
    PageNumber: pageNumber,
    PageSize: pageSize,
    TotalSize: totalSize,
    Errors: null,
});
