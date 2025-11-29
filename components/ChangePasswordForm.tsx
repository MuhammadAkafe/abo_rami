"use client"

import { useState } from 'react';
import { UpdateSupplierPassword } from '@/app/actions/UpdateSupplierPassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChangePasswordFormProps {
  supplierId: string;
}

export default function ChangePasswordForm({ supplierId }: ChangePasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error('סיסמה חייבת להכיל לפחות 8 תווים', {
        position: 'top-left',
        rtl: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('הסיסמאות אינן תואמות', {
        position: 'top-left',
        rtl: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await UpdateSupplierPassword(supplierId, newPassword);
      
      if (result.success) {
        toast.success('הסיסמה עודכנה בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(result.error || 'שגיאה בעדכון הסיסמה', {
          position: 'top-left',
          rtl: true,
        });
      }
    } catch (error) {
      toast.error('שגיאה בעדכון הסיסמה', {
        position: 'top-left',
        rtl: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          סיסמה חדשה
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="הזן סיסמה חדשה (לפחות 8 תווים)"
          required
          minLength={8}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          אישור סיסמה
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="הזן שוב את הסיסמה"
          required
          minLength={8}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'מעדכן...' : 'עדכן סיסמה'}
      </button>
    </form>
  );
}


