import axios from "axios";
import { useState } from "react";
import { useError } from "./useError";
import { redirect, useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {

  const { error, setError, loading, setLoading, success, setSuccess } = useError();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const LoginHandler = async (e: React.FormEvent, formData: LoginFormData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axios.post('/login', formData);
      console.log(response.data);
      if (response.status === 200) {
        setSuccess(true);
        router.push('/dashboard');
      }
    } catch (err) 
    {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        setError(errorData?.message || errorData?.error || 'אירעה שגיאה בהתחברות. אנא נסו שוב.');
      }
    }
    finally {
      setLoading(false);
    }
  };
  
  return {
    LoginHandler,
    error,
    loading,
    success,
    formData,
    handleChange
  };
};