import { suppliers, tasks, cities } from "@prisma/client";

// Export the Status enum type for use throughout the application




export type Status = 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface TaskFilters {
  status: Status;
  startDate: Date | string;
  endDate: Date | string;
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

export type City = cities;


export type ActiveView = 'dashboard' | 'suppliers' | 'tasks' | 'addSupplier' | 'addTask';



export type Task= {
    id?:  number;
    supplierId: string;
    status?: Status;
    address: string;
    description: string;
    city: string;
    supplier?: suppliers;
    phone?: string;
    url?: string;
    date?: Date  | string;
};


export type supplierList = {
  id: number | string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  cities?: City[] | null;
}



export interface NewSupplier {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  cities: string[];
}


export interface DeleteModalState {
  isOpen: boolean;
  Supplier?: supplierList | null;
  isLoading: boolean;
  task?: tasks | null;
}

export interface SuppliersTableProps {
  filters?: suppliers[];
  refetch?: () => void;
}





export interface TasksTableProps {
  tasks: Task[];
  title?: string;
  refetch?: () => void;
  filters?: TaskFilters;
}


