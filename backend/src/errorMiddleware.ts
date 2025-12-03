
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status?: number;
}

export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): void {
    console.error(err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({error: 'Route not found'});
}
