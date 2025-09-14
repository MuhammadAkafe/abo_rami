export const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  export const getStatusText = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'הושלם';
      case 'REJECTED':
        return 'נדחה';
      case 'PENDING':
        return 'ממתין';
      default:
        return 'לא מוגדר';
    }
  };

  export const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  export const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'גבוה';
      case 'MEDIUM':
        return 'בינוני';
      case 'LOW':
        return 'נמוך';
      default:
        return 'לא מוגדר';
    }
  };