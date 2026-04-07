import { Response } from "express";

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const sendResponse = <T>(res: Response, statusCode: number, message: string, data: T): void => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    } as IApiResponse<T>);
};

export default sendResponse;