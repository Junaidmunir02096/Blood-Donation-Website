/** Escape a spreadsheet cell and neutralize formula-like user input. */
export const escapeCsvCell = (value) => {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

export const rowsToCsv = (rows) =>
  rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
