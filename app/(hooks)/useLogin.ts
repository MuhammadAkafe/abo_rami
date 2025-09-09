import axios from "axios";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

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
      const response = await axios.post('/api/login', formData);
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
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