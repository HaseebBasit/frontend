// Base API URL with fallback "OR" method
// Supports Vercel deployed backend and localhost
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://authentication-backend-two-eta.vercel.app" ||
  "http://localhost:2707";

