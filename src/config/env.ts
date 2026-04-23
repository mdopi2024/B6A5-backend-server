

interface EnvConfig {
    STRIPE_WEBHOOK_SECRET: string
    STRIPE_SECRET_KEY: string
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    NODE_ENV: string
    DATABASE_URL: string
    PORT: string
    PROD_APP_URL:string,
    APP_URL:string
    FRONTEND_URL:string
}



const loadEnv = (): EnvConfig => {
    const envList = [
        "PORT",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_SECRET_KEY",
        "BETTER_AUTH_URL",
        "BETTER_AUTH_SECRET",
        "NODE_ENV",
        "DATABASE_URL",
        "PROD_APP_URL",
        "APP_URL",
        "FRONTEND_URL"

    ]


    envList.forEach((env) => {
        if (!process.env[env]) {
            throw new Error(`Missing environment variable: ${env}`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        NODE_ENV: process.env.NODE_ENV as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        PROD_APP_URL: process.env.PROD_APP_URL as string,
        APP_URL: process.env.APP_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
    };

}


export const envVar = loadEnv()