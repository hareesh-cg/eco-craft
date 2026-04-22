import { createBrowserClient } from "@supabase/ssr";

function isValidUrl(url: string | undefined): boolean {
  try { new URL(url!); return true; } catch { return false; }
}

const SUPABASE_URL = isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? process.env.NEXT_PUBLIC_SUPABASE_URL!
  : "https://placeholder.supabase.co";

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("eyJ")
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTc1NzgxMzA1N30.placeholder";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
