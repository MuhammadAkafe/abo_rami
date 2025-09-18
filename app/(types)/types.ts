import { Role, Status, users } from "@prisma/client";

// Export the Status enum type for use throughout the application
export { Status };

// You can also create a union type if you prefer
export type StatusValues = Status;





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


export interface NewTask {
  address: string;
  description: string;
  userid: number | null;
  date: Date | null;
  taskArea: string;
}



export interface NewSupplier 
{
  userid: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
}


export interface City {
  name: string;
  english_name: string;
  long: number;
  latt: number;
}