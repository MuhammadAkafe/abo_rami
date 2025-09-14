import { Status, Priority, type Status as StatusType, type Priority as PriorityType, Suppliers } from "@prisma/client";

// Export the Status enum type for use throughout the application
export { Status, Priority };
export type { StatusType, PriorityType };

// You can also create a union type if you prefer
export type StatusValues = StatusType;
export type PriorityValues = PriorityType;


export interface PriorityInterface {
    id: number;
    value: PriorityType;
}



export interface LoginFormData {
    email: string;
    password: string;
  }



  // Types for better type safety
export interface CreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    message?: string;
    user?: Partial<Suppliers>;
    errors?: Record<string, string>;
  }