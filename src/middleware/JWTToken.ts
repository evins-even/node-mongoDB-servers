import { NextFunction, Request, Response } from "express";


export const JWTToken = (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.authorization){
        
    }
};