import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../generated/prisma/enums";
import { bearer } from "better-auth/plugins";



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: ["https://boshonto-totel-management-frontend.vercel.app", "http://localhost:3000"],
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.GUEST
            },

            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            },

            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null
            },
        }
    },
    plugins: [
        bearer()
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    advanced: {
        cookiePrefix: "better-auth",
        useSecureCookies: process.env.NODE_ENV === "production",
        crossSubDomainCookies: {
            enabled: false,
        },
        disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
    },


});