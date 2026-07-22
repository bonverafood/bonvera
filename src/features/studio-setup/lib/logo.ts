/** Keep logos small — draft lives in localStorage (~5MB quota shared). */
export const MAX_LOGO_BYTES = 512 * 1024;

export const ALLOWED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;

export type LogoValidationError = "type" | "size";

export function validateLogoFile(file: File): LogoValidationError | null {
  if (!(ALLOWED_LOGO_TYPES as readonly string[]).includes(file.type)) {
    return "type";
  }
  if (file.size > MAX_LOGO_BYTES) {
    return "size";
  }
  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read file"));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
