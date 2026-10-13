/**
 * Accept only same-origin path redirects. Protocol-relative paths and Windows
 * path separators can otherwise be interpreted as external destinations.
 */
export const getSafeInternalPath = (value, fallback = '/dashboard') => {
  if (typeof value !== 'string') return fallback;

  const path = value.trim();
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return fallback;
  }

  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    decodedPath.startsWith('//') ||
    path.includes('\\') ||
    decodedPath.includes('\\')
  ) {
    return fallback;
  }

  try {
    const base = 'https://lifestream.local';
    const url = new URL(path, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
};
