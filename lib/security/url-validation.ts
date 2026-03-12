/**
 * URL and Image Source Validation Utilities
 * Prevents XSS attacks via malicious image/media URLs
 * Protects against javascript: and data: URI injection
 */

/**
 * Validates that a URL is safe to use as an image src
 * Only allows http:// and https:// protocols
 * Rejects javascript:, data:, and other dangerous protocols
 *
 * @param url - The URL to validate
 * @param allowedDomains - Optional whitelist of allowed domains (e.g., ['s3.amazonaws.com', 'cdn.example.com'])
 * @returns true if URL is safe, false otherwise
 */
export function isValidImageUrl(url: string | undefined | null, allowedDomains?: string[]): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Reject relative URLs that could be interpreted as protocols
    if (url.startsWith('//') || url.startsWith('\\')) {
      return false;
    }

    // Handle relative URLs (safe)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Only allow relative paths starting with /
      return url.startsWith('/');
    }

    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // If allowedDomains whitelist provided, check against it
    if (allowedDomains && allowedDomains.length > 0) {
      const hostname = urlObj.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain =>
        hostname === domain.toLowerCase() ||
        hostname.endsWith('.' + domain.toLowerCase())
      );
      return isAllowed;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Sanitizes a URL for safe use as image src
 * Returns the URL if valid, or a safe placeholder if not
 *
 * @param url - The URL to sanitize
 * @param placeholder - Fallback URL if original is invalid (default: empty data URL)
 * @param allowedDomains - Optional domain whitelist
 * @returns Safe URL or placeholder
 */
export function sanitizeImageUrl(
  url: string | undefined | null,
  placeholder: string = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23E5E0D8" width="100" height="100"/%3E%3C/svg%3E',
  allowedDomains?: string[]
): string {
  return isValidImageUrl(url, allowedDomains) ? url : placeholder;
}

/**
 * Validates a URL for general use (not just images)
 * More permissive than image validation - allows more protocols
 *
 * @param url - The URL to validate
 * @returns true if URL is safe, false otherwise
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Reject dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
    const lowerUrl = url.toLowerCase().trim();

    if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
      return false;
    }

    // If it looks like a protocol-based URL, validate as URL
    if (url.includes(':')) {
      const urlObj = new URL(url);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol);
    }

    // Relative URLs are safe
    return true;
  } catch {
    // If URL parsing fails but it's a relative path, allow it
    return url.startsWith('/') || url.startsWith('#');
  }
}

/**
 * Configuration for common CDN/image hosting services
 * Use with isValidImageUrl(url, SAFE_IMAGE_DOMAINS)
 */
export const SAFE_IMAGE_DOMAINS = {
  AWS_S3: ['s3.amazonaws.com', 's3-us-east-1.amazonaws.com', 's3-eu-west-1.amazonaws.com'],
  CLOUDFLARE: ['cdn.example.com', 'images.example.com'],
  GOOGLE_CLOUD: ['storage.googleapis.com'],
  AZURE: ['blob.core.windows.net'],
  EVENTYLIFE: ['eventylife.fr', 'www.eventylife.fr', 'cdn.eventylife.fr'],
} as const;

/**
 * Get combined whitelist for common services
 */
export function getCommonCdnWhitelist(): string[] {
  return [
    ...SAFE_IMAGE_DOMAINS.AWS_S3,
    ...SAFE_IMAGE_DOMAINS.CLOUDFLARE,
    ...SAFE_IMAGE_DOMAINS.GOOGLE_CLOUD,
    ...SAFE_IMAGE_DOMAINS.AZURE,
    ...SAFE_IMAGE_DOMAINS.EVENTYLIFE,
  ];
}
