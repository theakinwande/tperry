/**
 * Transform a Cloudinary URL to serve an optimized version.
 * Inserts width, quality, and format params into the URL path.
 *
 * Example:
 *   Input:  https://res.cloudinary.com/xxx/image/upload/v123/folder/img.jpg
 *   Output: https://res.cloudinary.com/xxx/image/upload/w_600,q_auto,f_auto/v123/folder/img.jpg
 */
export function optimizeCloudinaryUrl(
  url: string,
  width: number = 600
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url; // Not a Cloudinary URL, return as-is
  }

  // Insert transformation after /upload/
  const uploadSegment = '/upload/';
  const idx = url.indexOf(uploadSegment);
  if (idx === -1) return url;

  const before = url.slice(0, idx + uploadSegment.length);
  const after = url.slice(idx + uploadSegment.length);

  return `${before}w_${width},q_auto,f_auto/${after}`;
}
