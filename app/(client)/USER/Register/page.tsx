"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { validateRegisterForm } from "@/app/validtion";
import { Role } from "@prisma/client";
import { RegisterFormData } from "@/app/validtion";
import { useRouter } from "next/navigation";
import { useAddSupplier } from "@/app/hooks/useSupplier";
import LoadingButton from "@/app/components/loadingButton";
import { users } from "@prisma/client";
import BackUpBtn from "@/app/components/backUpBtn";

interface SupplierFormData extends RegisterFormData {
  userid: number | null;
}


export default function RegisterPage() {
  const [formData, setFormData] = useState<SupplierFormData>({
    userid: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: Role.USER
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter()
  const mutation = useAddSupplier();
  const [users, setUsers] = useState<users[] | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        const response = await fetch('/api/SystemPermission/GetAllUsers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        // Handle the new API response structure
        if (data.success && Array.isArray(data.data)) {
          setUsers(data.data);
        } else if (Array.isArray(data)) {
          // Fallback for old API format
          setUsers(data);
        } else {
          console.error('Invalid users data format:', data);
          setUsers([]);
          setUsersError('פורמט נתונים לא תקין');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setUsersError('שגיאה בטעינת רשימת המעסיקים');
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateRegisterForm(formData);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors({});
    mutation.mutate(formData, 
      {
      onSuccess: () => {
        // Reset form
        setFormData({
          userid:   null,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: Role.USER
        });
        // Redirect after a short delay
          router.push('/USER/Login');
      },
      onError: (error) => {
        console.error('Registration error:', error);
      }
    });
  };


  






  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 relative">


      {/* Back Button - Top Middle */}
      <BackUpBtn />

      {/* Header at the top */}
      <div className="pt-8 pb-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            צרו את החשבון שלכם
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הצטרפו אלינו היום והתחילו
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-center p-4">
        <div className="max-w-6xl w-full space-y-8">

        {/* Success Message */}
        {mutation.isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">ההרשמה הושלמה בהצלחה!</p>
            <p className="text-sm">אתם מועברים לעמוד ההתחברות...</p>
          </div>
        )}

        {/* Error Message */}
        {mutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{mutation.error?.message || 'שגיאה בהרשמה'}</p>
          </div>
        )}

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10" dir="rtl">
            <form onSubmit={handleSubmit}>
            {/* Horizontal Layout - All fields in one row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* First Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    שם פרטי
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    autoComplete="given-name"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={mutation.isPending}
                    placeholder="שם פרטי"
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת אימייל
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={mutation.isPending}
                    placeholder="yohanan@example.com"
                    maxLength={100}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    סיסמה
                  </label>
                  <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                      fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="צרו סיסמה חזקה"
                  />
                  {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                </div>
              </div>

              {/* Second Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    שם משפחה
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    autoComplete="family-name"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={mutation.isPending}
                    placeholder="שם משפחה"
                  />
                   {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                    )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    מספר טלפון
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    autoComplete="tel"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                      fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0501234567"
                  />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                    )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    אשרו סיסמה
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                      fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="אשרו את הסיסמה שלכם"
                  />
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                </div>
              </div>

              {/* Third Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-2">
                    שם המעסיק
                  </label>
                  <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    id="userid"
                    name="userid"
                    value={formData.userid ?? ""}
                    onChange={handleInputChange}
                    disabled={usersLoading || mutation.isPending}
                    required
                  >
                    <option value="">
                      {usersLoading ? 'טוען מעסיקים...' : usersError ? 'שגיאה בטעינה' : 'בחרו מעסיק'}
                    </option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                    ))}
                  </select>
                  {usersError && (
                    <p className="mt-1 text-sm text-red-600">{usersError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-end">
                  <LoadingButton loading={mutation.isPending} text="צרו חשבון" />
                </div>
              </div>
            </div>
          </form>




          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              יש לכם כבר חשבון?{" "}
              <Link href="/USER/Login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                התחברו
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
