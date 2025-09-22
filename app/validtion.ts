import { z } from "zod";
import { Role } from "@prisma/client";

// Simple validation schema with Hebrew error messages
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(3, "שם פרטי חייב להכיל לפחות 3 תווים")
    .max(20, "שם פרטי ארוך מדי")
    .regex(/^[\u0590-\u05FF\s]+$/, "שם פרטי חייב להכיל רק אותיות עבריות"),

  lastName: z
    .string()
    .min(3, "שם משפחה חייב להכיל לפחות 3 תווים")
    .max(20, "שם משפחה ארוך מדי")
    .regex(/^[\u0590-\u05FF\s]+$/, "שם משפחה חייב להכיל רק אותיות עבריות"),

  email: z
    .string()
    .email("כתובת אימייל לא תקינה"),

  phone: z
    .string()
    .regex(/^(05\d{8}|\+9725\d{8})$/, "מספר טלפון חייב להתחיל ב-05 או +972 ולהכיל 10 ספרות"),

  password: z
    .string()
    .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
    .max(50, "סיסמה ארוכה מדי")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה וספרה"),

  role: z.nativeEnum(Role, { message: "תפקיד חייב להיות USER או ADMIN" }),

  confirmPassword: z
    .string()
    .min(8, "אישור סיסמה חייבת להכיל לפחות 8 תווים")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה וספרה"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

export const emailSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  isAdmin: z.boolean(),
});

export const otpSchema = z.object({
  code: z.string().length(6, "קוד האימות חייב להכיל 6 ספרות"),
});

export const passwordResetSchema = z.object({
  password: z
    .string()
    .min(6, "סיסמה חייבת להכיל לפחות 6 תווים")
    .max(50, "סיסמה ארוכה מדי"),
  confirmPassword: z
    .string()
    .min(6, "אישור סיסמה חייב להכיל לפחות 6 תווים"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

// Type for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;



// Simple validation function
export const validateRegisterForm = (data: RegisterFormData) => {
  try {
    registerSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "שגיאה" } };
  }
};

export const validateEmailForm = (data: EmailFormData) => {
  try {
    emailSchema.parse(data);
    return { success: true, errors: {}, data };
  } catch (error) {

    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { success: false, errors, data: null };
    }
    return { success: false, errors: { general: "שגיאה" }, data: null };
  }
};

export const validateOTPForm = (data: OTPFormData) => {
  try {
    otpSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "שגיאה" } };
  }
};

export const validatePasswordResetForm = (data: PasswordResetFormData) => {
  try {
    passwordResetSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "שגיאה" } };
  }
};

