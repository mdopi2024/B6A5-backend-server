import { Role } from "../generated/prisma/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";


async function registerAdmin() {

    const adminEmail = "admin@gmail.com";
    const adminPassword = "12345678"; // admin password
    const adminName = "Admin";

    // 1️⃣ Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
       const result = await auth.api.signUpEmail(
            {
                body: {
                    name: adminName,
                    email: adminEmail,
                    password: adminPassword,
                    role: Role.ADMIN,
                }
            }
        );
        if(result.user){
              console.log("success")
        }
    }
}
// Run the function
registerAdmin();