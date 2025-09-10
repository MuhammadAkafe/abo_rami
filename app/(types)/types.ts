import { Status, Priority, type Status as StatusType, type Priority as PriorityType } from "@/generated/prisma/client";

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