import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/constans/constans";
import { setSupplierAuth } from "@/lib/authUtils";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    supplier: {
      id: number;
      clerkId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      cities: Array<{
        id: number;
        city: string;
        supplierId: number;
      }>;
      createdAt: Date;
    };
  };
}

const loginSupplier = async (loginData: LoginData): Promise<LoginResponse> => {
  const response = await fetch("/api/USER/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "שגיאה בהתחברות");
  }

  return response.json();
};

export const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: loginSupplier,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Store authentication data using utility function
        setSupplierAuth(data.data.token, data.data.supplier);
        
        // Redirect to supplier dashboard
        router.push(CLIENT_ROUTES.SUPPLIER.DASHBOARD);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useLogin;
