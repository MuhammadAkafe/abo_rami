export const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  export const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'הושלם';
      case 'rejected':
        return 'נדחה';
      case 'pending':
        return 'ממתין';
      default:
        return 'לא מוגדר';
    }
  };

  export const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  export const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'גבוה';
      case 'medium':
        return 'בינוני';
      case 'low':
        return 'נמוך';
      default:
        return 'לא מוגדר';
    }
  };