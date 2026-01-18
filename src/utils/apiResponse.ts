import { Response } from "express";

/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    status?: number;
}

/**
 * 成功响应
 * @param res Express Response 对象
 * @param data 返回的数据
 * @param message 提示信息
 * @param status HTTP 状态码（默认 200）
 */
export function successResponse<T>(
    res: Response,
    data: T,
    message: string = "success",
    status: number = 200
): void {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
        status,
    };
    res.status(status).json(response);
}

/**
 * 错误响应
 * @param res Express Response 对象
 * @param error 错误信息
 * @param status HTTP 状态码（默认 400）
 */
export function errorResponse(
    res: Response,
    error: string,
    status: number = 400
): void {
    const response: ApiResponse = {
        success: false,
        error,
        status,
    };
    res.status(status).json(response);
}

/**
 * 通用响应函数（兼容你提供的函数签名）
 * @param data 返回的数据
 * @param message 提示信息
 * @param status HTTP 状态码（默认 200）
 * @returns 响应对象（不包含 res，需要配合 res.json() 使用）
 */
export function apiResponse<T>(
    data: T,
    message: string = "success",
    status: number = 200
): ApiResponse<T> {
    return {
        success: status >= 200 && status < 300,
        data,
        message,
        status,
    };
}

