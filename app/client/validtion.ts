import { z } from "zod";

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
    .max(50, "סיסמה ארוכה מדי"),
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה וספרה"),


  confirmPassword: z
    .string()
    .min(8, "אישור סיסמה חייבת להכיל לפחות 8 תווים"),
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה וספרה"),

    
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});





// Type for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;




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







