
import { Request, Response, NextFunction } from "express";
import * as z from 'zod'

const validateRequest = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if(req.body.data){
        req.body = JSON.parse(req.body.data)
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
       next(result.error)
    }

    req.body = result.data; 
    next();
  };
};

export default validateRequest;