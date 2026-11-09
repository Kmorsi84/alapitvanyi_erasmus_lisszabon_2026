/**
 * Resolves an asset URL taking into account the base path (e.g. for GitHub Pages vs Vercel).
 */
export function getAssetUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Remove leading slash for clean concatenation with base URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';

  // If already prefixed with base URL, avoid duplicate prefix
  if (baseUrl !== '/' && path.startsWith(baseUrl)) {
    return path;
  }

  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
}
