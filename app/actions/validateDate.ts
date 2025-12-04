        // Date validation

        interface validateDateResult {
            isValid: boolean;
            date?: Date;
            error?: string;
        }

        export default function validateDate(dateString: string): validateDateResult {
            if (!dateString) {
                return { isValid: false, error: "Date is required" };
            }

            const date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                return { isValid: false, error: "Invalid date format" };
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                return { isValid: false, error: "Date cannot be in the past" };
            }

            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            
            if (date > maxDate) {
                return { isValid: false, error: "Date cannot be more than 1 year in the future" };
            }

            return { isValid: true, date };
        }