// Simple utility functions without external dependencies
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
