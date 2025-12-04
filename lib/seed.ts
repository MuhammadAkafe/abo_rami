import "dotenv/config";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const addAdmin = async () => {
  try {
    const password = await bcrypt.hash("adminadmin", 10);
    const admin = await prisma.users.create({
      data: {
        email: "admin@example.com",
        firstName: "אבו ראמי",
        lastName: "",
        phone: "0585774408",
        role: "ADMIN",
        password: password,
      },
    });
    console.log("✅ Admin user created successfully:", admin.email);
  } catch (error: unknown) 
  {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      console.log("ℹ️  Admin user already exists");
    } 
    else {
      console.error("❌ Error creating admin user:", error);
      throw error;
    }
  }
};

const delete_admin = async () => {
  try {
    // Delete admin user by email
    const deletedAdmin = await prisma.users.deleteMany();
    
    if (deletedAdmin.count > 0) {
      console.log(`✅ Admin user deleted successfully (${deletedAdmin.count} user(s))`);
    } else {
      console.log("ℹ️  Admin user not found");
    }
  } catch (error) {
    console.error("❌ Error deleting admin user:", error);
    throw error;
  }
};

const main = async () => {
  try {
    // await delete_admin();
    await addAdmin();
    console.log("✅ Seed completed successfully!");
  } 
  catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } 
  finally {
    await prisma.$disconnect();
  }
};

main();
