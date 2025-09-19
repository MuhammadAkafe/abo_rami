import { Role } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

interface AdminSignUpProps {
    email: string;
    password: string;
}

const adminSignUp = async ({email, password}: AdminSignUpProps) => {
        const result = await signIn('credentials', {
          email: email,
          password: password,
          role: Role.ADMIN,
          redirect: false,
        });
        
        // Return the result which includes error information
        return result;
};



export const useAdminSignUp = () => {
    return useMutation({
        mutationFn:adminSignUp,
    });
};




