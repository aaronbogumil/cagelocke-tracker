// Helper to access environment variables
export const getEnv = (key: string): string => {
  const value = import.meta.env[key]
  if (!value) {
    console.warn(`Environment variable ${key} is not set`)
  }
  return value || ''
}

export const config = {
  supabaseUrl: getEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnv('VITE_SUPABASE_ANON_KEY'),
}