"use client"

import { useState } from 'react';
import { validateRegisterForm, type RegisterFormData } from '@/app/validtion';
import { Role } from '@/generated/prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: Role.USER
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear previous errors for this field
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setError(null);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const RegisterHandler = async (e: React.FormEvent, formData: RegisterFormData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      // Validate the form data
      const validation = validateRegisterForm(formData);
      if (!validation.success) {
        setFieldErrors(validation.errors);
        setError('אנא תקנו את השגיאות בטופס');
        setLoading(false);
        return;
      }

      // Make API call to register
      const response = await axios.post('/api/register', formData);
      if (response.data.success) {
        setSuccess(true);
       new Promise((resolve) => { setTimeout(resolve, 1000); }) .then(() => {
          router.push('/Login');
      });}
      

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        
        // If the error is an object with field errors, set field errors
        if (errorData?.errors && typeof errorData.errors === 'object') {
          setFieldErrors(errorData.errors);
          setError('אנא תקנו את השגיאות בטופס');
        } else {
          // If it's a string error message, display it
          setError(errorData?.message || errorData?.error || 'אירעה שגיאה בהרשמה. אנא נסו שוב.');
        }
      } 
      else {
        setError(`אירעה שגיאה בהרשמה. אנא נסו שוב`);
      }
    }
     finally {
      setLoading(false);
    }
  };

  return {
    RegisterHandler,
    error,
    fieldErrors,
    loading,
    success,
    formData,
    handleChange
  };
};