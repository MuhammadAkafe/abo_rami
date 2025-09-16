import { Status, Priority, type Status as StatusType, type Priority as PriorityType, users } from "@prisma/client";

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
    user?: Partial<users>;
    errors?: Record<string, string>;
  }



  export interface TaskFilters {
    status: string;
    priority: string;
    startDate: string;
    endDate: string;
  }
  
  

  export interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
    isLoading?: boolean;
  }

  export interface ControlPanelProps {
    navigate?: (path: string) => void
    activeTab?: string
}