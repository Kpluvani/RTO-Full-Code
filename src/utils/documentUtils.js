// Utility functions for document upload and preview
import axiosInstance from '@/config/axiosConfig';

/**
 * Detect if a string is a base64 PDF
 * @param {string} str
 * @returns {boolean}
 */
export function isBase64Pdf(str) {
  return typeof str === "string" && str.startsWith("data:application/pdf");
}

/**
 * Detect if a string is a base64 image (jpeg/png)
 * @param {string} str
 * @returns {boolean}
 */
export function isBase64Image(str) {
  return (
    typeof str === "string" &&
    (str.startsWith("data:image/jpeg") || str.startsWith("data:image/png"))
  );
}

/**
 * Detect if a string is a URL (http/https)
 * @param {string} str
 * @returns {boolean}
 */
export function isUrl(str) {
  return typeof str === "string" && /^https?:\/\//.test(str);
}

/**
 * Detect if a string is a file path (relative or absolute)
 * @param {string} str
 * @returns {boolean}
 */
export function isFilePath(str) {
  return typeof str === "string" && (str.startsWith("/uploads/") || str.match(/\\|\//));
}

/**
 * Convert base64 to Blob URL for PDF preview
 * @param {string} base64
 * @param {string} mimeType
 * @returns {string|null}
 */
export function base64ToBlobUrl(base64, mimeType = "application/pdf") {
  try {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/**
 * Get backend static base URL from env (strip /api if present)
 * @returns {string}
 */
export function getBackendStaticBaseUrl() {
  let url = axiosInstance.getUri() || 'http://localhost:5000/api';
  if (url.endsWith('/api')) url = url.slice(0, -4);
  return url;
}