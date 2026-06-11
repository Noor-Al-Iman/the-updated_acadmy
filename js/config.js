// Environment configuration - loads from global window object or injected process env
const processEnv = typeof process !== "undefined" ? process.env : undefined;

window.ENV = {
  SUPABASE_URL: processEnv?.SUPABASE_URL || window.ENV?.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: processEnv?.SUPABASE_ANON_KEY || window.ENV?.SUPABASE_ANON_KEY || '',
};