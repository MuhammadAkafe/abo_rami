import "dotenv/config";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";


type Role = "ADMIN" | "USER";


interface Admin {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}


const addAdmin = async ({firstName,lastName,email,phone,password,role}:Admin) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.users.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role,
        password: hashedPassword,
      },
    });
    console.log(`✅ Admin user created successfully: ${firstName} ${lastName} (${email})`);
  } catch (error: unknown) 
  {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      console.log("ℹ️  Admin user already exists");
    } 
    else {
      console.error("❌ Error creating admin user:", error);
      process.exit(1);
    }
  }
};

const edit_admin=async(email:string,phone:string)=>{
try {
  const admin=await prisma.users.update({
    where:{
      email:email
    },
    data:{
      phone:phone
    }
  })
  if(!admin){
    console.log(`admin ${email} not found`);
    return;
  }

  console.log("✅ Admin user updated successfully:", admin.email);
} 
catch (error) {
  console.error("❌ Error editing admin user:", error);
  process.exit(1);
}
}



const delete_admin = async (email:string) => {
  try {
    // Delete admin user by email
    const deletedAdmin = await prisma.users.delete({
      where:{
        email:email
      }
    })
    if(!deletedAdmin){
      console.log(`admin ${email} not found`);
      return;
    }
    console.log(`✅ Admin user deleted successfully (${deletedAdmin.email})`);
  } catch (error) {
    console.error("❌ Error deleting admin user:", error);
    process.exit(1);
  }
};


