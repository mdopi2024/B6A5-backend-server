/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import status from "http-status"
import { auth } from "../lib/auth"
import { Role } from "../generated/prisma/enums"



export const checkAuth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            })
            console.log("Headers:", req.headers)
            console.log("Session:", session)
        
            
            if (!session) {
                return res.status(status.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized access"
                })
            }
         
            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as Role,
            }

            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(status.FORBIDDEN).json({
                    success: false,
                    message: "You do not have permission to access this resource"
                })
            }

            next()
        } catch (error: any) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "Authentication failed"
            })
        }
    }
}