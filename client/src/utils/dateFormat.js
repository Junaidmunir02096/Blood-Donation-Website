/** Parses 'YYYY-MM-DD' string as a local Date (avoids UTC off-by-one) */
export const parseLocalDate = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  return formatDateInputValue(date) === str ? date : null;
};

/** Formats a Date as the value expected by an HTML date input. */
export const formatDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Formats a Date for display, e.g. "Jun 16, 2026" */
export const formatDisplayDate = (str) => {
  const d = parseLocalDate(str);
  if (!d) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
