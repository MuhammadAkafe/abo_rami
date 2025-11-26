import "dotenv/config";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const addAdmin = async () => {
  try {
    const admin = await prisma.users.create({
      data: {
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "Admin",
        phone: "1234567890",
        role: "ADMIN",
        password: await bcrypt.hash("admin123", 10),
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

const delete_users = async () => {
  try {
    await prisma.users.deleteMany();
    console.log("✅ Users deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting users:", error);
    throw error;
  }
};

const main = async () => {
  try {
    await delete_users();
    await addAdmin();
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
