/** Parses 'YYYY-MM-DD' string as a local Date (avoids UTC off-by-one) */
const parseLocalDate = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
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
