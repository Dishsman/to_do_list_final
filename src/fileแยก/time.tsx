export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
  
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,  // Use AM/PM format
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
  
    // Format the date and time using toLocaleString
    // return date.toLocaleString('en-US', options);
    
      // Get the formatted date and time
  const formattedDate = date.toLocaleString('en-US', options);

  // Rearrange the formatted string to show time first, then date (DD/MM/YYYY)
  const [datePart, timePart] = formattedDate.split(', ');
  const [month, day, year] = datePart.split('/');
  return `${timePart} ${day}/${month}/${year}`;
  };