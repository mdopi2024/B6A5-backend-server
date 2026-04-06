import { app } from "./app";
import { prisma } from "./lib/prisma";


const port = process.env.PORT || 5000;

const server = async () => {
    try {
        // ✅ Prisma connect করো
        await prisma.$connect();
        console.log("✅ Database connected successfully!");

        app.listen(port, () => {
            console.log(`✅ Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        // ❌ Error হলে disconnect করো এবং বন্ধ করো
        console.error("❌ Database connection failed!", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

server();