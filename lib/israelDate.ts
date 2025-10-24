export const getTodayIsraelDate = () => {
  const now = new Date();
  const israelDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
  return israelDate; // Returns YYYY-MM-DD format
};