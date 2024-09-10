// format the date into YYYY-MM-DD
export function getInitialDateAsString() {
  const oneWeekFromNow = getInitialDueDate();

  const year = oneWeekFromNow.getFullYear();
  const month = String(oneWeekFromNow.getMonth() + 1).padStart(2, '0');
  const day = String(oneWeekFromNow.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// default initial due date is ONE WEEK from creation
export function getInitialDueDate() {
  const today = new Date();
  const oneWeekFromNow = new Date(today.setDate(today.getDate() + 7)); // add 1 week

  return oneWeekFromNow;
}