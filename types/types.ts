import { Role, Status, users, suppliers, tasks } from "@prisma/client";

// Export the Status enum type for use throughout the application
export { Status };

// You can also create a union type if you prefer
export type StatusValues = Status;

export type TaskWithSupplier = tasks & {
  supplier?: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  } | null;
};



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
  Supplier_id: number | null;
  date: Date | null;
  city: string;
}



export interface NewSupplier 
{
  userid: string | null;
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


export interface DeleteModalState 
{
    isOpen: boolean;
    Supplier?: suppliers | null;
    isLoading: boolean;
    task?: tasks | null;
}
export interface SuppliersTableProps {
    filters: suppliers[];
    refetch: () => void;
}


export interface TasksTableProps {
  title?: string;
  refetch?: () => void;
  filters?: TaskFilters;
  showDeleteButton?: boolean;
}